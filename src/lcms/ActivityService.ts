import { ConfigService } from "../ConfigService";
import { Activity, View, Field, FieldUpsertDto } from "declarations/lcms-api-schema";
import { LoginService } from "./LoginService";

const log = console.log;

export class ActivityService {

    private static instance: ActivityService;
    private loginService: LoginService;
    private activeActivity?: Activity;
    private views: View[] = [];
    private fields: Field[] = [];

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

    private async loadViews(): Promise<View[]> {
        this.views = await this.getViews();
        log(`Got ${this.views.length} views: ${this.views.map(v => v.name).join(', ')}`);
        return this.views;
    }

    public async getViews(): Promise<View[]> {
        let route = ConfigService.ROUTES.VIEWS.replace('{activityUuid}', this.activeActivity?.id || '');
        return ConfigService.axiosGet(route, { headers: this.loginService.getAuthorizationHeader() });
    }

    public async getFieldsByViewName(viewName: string): Promise<Field[]> {
        await this.loadViews();
        const view = this.views.find(v => v.screenTitle === viewName);
        if (!view) return [];
        let route = ConfigService.ROUTES.FIELDS.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', view.uuid);
        console.log(route);
        return ConfigService.axiosGet(route, { headers: this.loginService.getAuthorizationHeader() });
    }

    public async getFieldsByViewId(viewUuid: string): Promise<Field[]> {
        let route = ConfigService.ROUTES.FIELDS.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', viewUuid);
        return ConfigService.axiosGet(route, { headers: this.loginService.getAuthorizationHeader() });
    }

    private async loadFieldsById(viewUuid: string): Promise<Field[]> {
        this.fields = await this.getFieldsByViewId(viewUuid);
        log(`Got ${this.fields.length} fields: ${this.fields.map(v => v.screenTitle).join(', ')}`);
        return this.fields;
    }

    public createField(viewUuid: string, field: FieldUpsertDto): Promise<Field> {
        let route = ConfigService.ROUTES.FIELDS.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', viewUuid);
        return ConfigService.axiosPost<Field>(route, field, { headers: this.loginService.getAuthorizationHeader() });
    }

    public updateField(viewUuid: string, fieldUuid: string, field: FieldUpsertDto): Promise<Field> {
        let route = ConfigService.ROUTES.FIELD.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', viewUuid).replace('{fieldUuid}', fieldUuid);
        return ConfigService.axiosPut<Field>(route, field, { headers: this.loginService.getAuthorizationHeader() });
    }

}