import { ConfigService } from "../ConfigService";
import { LoginService } from "./LoginService";
import { ActivityService } from "./ActivityService";
import { Activity, View, Drawing } from "../../declarations/lcms-api-schema";
import { InitStartService } from "./InitStartService";

const log = console.log;

export class LcmsAdapter implements InitStartService {

    private static instance: LcmsAdapter;
    private loginService: LoginService;
    private activityService: ActivityService;
    private _intitialized: boolean = false;

    private constructor() {
        this.loginService = LoginService.getInstance();
        this.activityService = ActivityService.getInstance();
    }

    public static getInstance(): LcmsAdapter {
        if (!LcmsAdapter.instance) {
            LcmsAdapter.instance = new LcmsAdapter();
        }
        return LcmsAdapter.instance;
    }

    /**
     * Login to the LCMS server through the LCMS-API, based on the configuration as configured in 
     * the config files and environment variables. Loads all activities and selects the 
     * configured activity, that is then passed on to the ActivityService.
     */
    public async init(): Promise<boolean> {
        try {
            const loggedIn = await this.loginService.login();
            const whoAmI = await this.loginService.whoAmI();
            log(`Logged in as ${whoAmI.displayName} (last seen ${(new Date(whoAmI.lastSeen)).toISOString()})`);
            const activeActivity = await this.findActivity();
            log(`Selected activity ${activeActivity.name}`);
            this.activityService.setActivity(activeActivity);
            return true;
        } catch (e) {
            console.error(e.message);
            console.error(`Could not login to LCMS: ${e.stack}`);
            return false;
        }
    }

    public async start() {
        log(`Fields that will be sent to the test-bed: ${ConfigService.getConfig().lcms.consumeDisciplines}`);
        this.scheduleAutoRefresh();
        this.updateLCMStoTestbed();
    }

    private scheduleAutoRefresh() {
        if (!ConfigService.getConfig().lcms.refreshTime || +ConfigService.getConfig().lcms.refreshTime <= 0) {
            log(`Auto-updating LCMS to Test-bed disabled! Use the 'refresh' parameter to set a scheduled update.`);
            return;
        }
        const refreshInterval = ConfigService.getConfig().lcms.refreshTime * 1000;
        log(`Schedule LCMS refresh in ${refreshInterval / 1000} seconds.`);
        setTimeout(() => {
            this.updateLCMStoTestbed();
        }, refreshInterval);
    }

    private async updateLCMStoTestbed() {
        log(`Fetching LCMS contents...`);
        try {
            const drawings: Drawing[] = await this.activityService.getDrawings();
            const views: View[] = await this.activityService.getViews();
            log(`Drawings: ${JSON.stringify(drawings)}`);
            log(`Got ${views.length} views: ${views.map(v => v.name).join(', ')}`);
            this.scheduleAutoRefresh();
        } catch (error) {
            console.error(`Error fetching LCMS contents... Scheduling retry in 5 seconds`);
            console.error(error.stack);
            setTimeout(() => {
                this.updateLCMStoTestbed();
            }, 5000);
        }
    }

    private async findActivity(): Promise<Activity> {
        const activities = await this.getActivities();
        if (!activities || !Array.isArray(activities))
            throw new Error(`No activities found`);
        if (activities.length === 1) {
            return activities[0];
        } else if (activities.length === 0) {
            throw new Error(`Activity ${ConfigService.getConfig().lcms.excercise} not found`);
        } else {
            log(`Multiple acitivities found with name ${ConfigService.getConfig().lcms.excercise}, selecting the first.`);
            log(`${JSON.stringify(activities)}`);
            return activities[0];
        }
    }

    private async getActivities(): Promise<Activity[]> {
        return this.activityService.getActivities();
    }

}
