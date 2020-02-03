import { ConfigService } from "../ConfigService";
import { Activity, View } from "declarations/lcms-api-schema";
import { LoginService } from "./LoginService";

const log = console.log;

export class ActivityService {

    private static instance: ActivityService;
    private loginService: LoginService;
    private activeActivity?: Activity;
    private views: View[] = [];

    private constructor() {
        this.loginService = LoginService.getInstance();
    }

    public static getInstance(): ActivityService {
        if (!ActivityService.instance) {
            ActivityService.instance = new ActivityService();
        }
        return ActivityService.instance;
    }

    public setActivity(activity: Activity) {
        this.activeActivity = activity;
        this.loadViews();
    }

    private async loadViews(): Promise<void> {
        this.views = await this.getViews();
        log(`Got ${this.views.length} views: ${this.views.map(v => v.name).join(', ')}`);
    }

    private async getViews(): Promise<View[]> {
        let route = ConfigService.ROUTES.VIEWS.replace('{activityUuid}', this.activeActivity?.id || '');
        return ConfigService.axiosGet(route, { headers: this.loginService.getAuthorizationHeader() });
    }

}