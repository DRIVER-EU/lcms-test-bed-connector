import { ConfigService } from "../ConfigService";
import { LoginService } from "./LoginService";
import { ActivityService } from "./ActivityService";
import { Activity } from "../../declarations/lcms-api-schema";

const log = console.log;

export class LcmsAdapter {

    private loginService: LoginService;
    private activityService: ActivityService;

    constructor() {
        this.loginService = LoginService.getInstance();
        this.activityService = ActivityService.getInstance();
        this.start();
    }

    /**
     * Login to the LCMS server through the LCMS-API, based on the configuration as configured in 
     * the config files and environment variables. Loads all activities and selects the 
     * configured activity, that is then passed on to the ActivityService.
     */
    public async start() {
        try {
            const loggedIn = await this.loginService.login();
            const whoAmI = await this.loginService.whoAmI();
            log(`Logged in as ${whoAmI.displayName} (last seen ${(new Date(whoAmI.lastSeen)).toISOString()})`);
            const activeActivity = await this.findActivity();
            log(`Selected activity ${activeActivity.name}`);
            this.activityService.setActivity(activeActivity);
        } catch (e) {
            console.error(e.message);
            console.error(`Could not login to LCMS: ${e.stack}`);
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
        let where: any = { //ActivityQuery
            name: ConfigService.getConfig().lcms.excercise,
            onlyOwnOrganization: false,
            onlyNotRead: false,
            category: 'RUNNING',
            onlyTemplate: false
        };
        let order: any = { //OrderBy<PaginationColumnsActivity> = {
            column: 'modified',
            ascending: true
        };
        let skip: number = 0;
        let limit: number = 10;
        let headers = { where: JSON.stringify(where), order: JSON.stringify(order), skip, limit, ...this.loginService.getAuthorizationHeader() };
        return ConfigService.axiosGet<Activity[]>(ConfigService.ROUTES.ACTIVITIES, { headers: headers });
    }
}
