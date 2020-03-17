import { ConfigService } from "../ConfigService";
import { Activity, View, Field, FieldUpsertDto, ViewUpsertDto, XHeadersActivities, Drawing, ViewHeader } from "declarations/lcms-api-schema";
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
        try {
            this.views = await this.getViews();
            log(`Got ${this.views.length} views: ${this.views.map(v => v.name).join(', ')}`);
            return this.views;
        } catch (err) {
            log(`Error loading views: ${err}`);
            return [];
        }
    }

    public async getViews(): Promise<View[]> {
        let route = ConfigService.ROUTES.VIEWS.replace('{activityUuid}', this.activeActivity?.id || '');
        return ConfigService.axiosGet(route, { headers: this.loginService.getAuthorizationHeader() });
    }

    public async getViewByName(viewName: string): Promise<View | undefined> {
        try {
            await this.loadViews();
            return this.views.find(v => v.screenTitle.toLocaleUpperCase() === viewName.toLocaleUpperCase());
        } catch (err) {
            log(`Error loading views: ${err}`);
            return;
        }
    }

    public async getViewHeaderByName(viewHeaderName: string): Promise<ViewHeader | undefined> {
        try {
            await this.loadViews();
            const view = this.views.find(v => v.header.name.toLocaleUpperCase() === viewHeaderName.toLocaleUpperCase());
            return view ? view.header : undefined;
        } catch (err) {
            log(`Error loading views: ${err}`);
            return;
        }
    }

    public async getFieldsByViewName(viewName: string): Promise<Field[]> {
        try {
            const view = await this.getViewByName(viewName);
            if (!view) return [];
            let route = ConfigService.ROUTES.FIELDS.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', view.uuid);
            console.log(route);
            return ConfigService.axiosGet(route, { headers: this.loginService.getAuthorizationHeader() });
        } catch (err) {
            log(`Error getting fields of view ${viewName}: ${err}`);
            return [];
        }
    }

    public async getFieldsByViewId(viewUuid: string): Promise<Field[]> {
        let route = ConfigService.ROUTES.FIELDS.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', viewUuid);
        return ConfigService.axiosGet(route, { headers: this.loginService.getAuthorizationHeader() });
    }

    private async loadFieldsById(viewUuid: string): Promise<Field[]> {
        try {
            this.fields = await this.getFieldsByViewId(viewUuid);
            log(`Got ${this.fields.length} fields: ${this.fields.map(v => v.screenTitle).join(', ')}`);
            return this.fields;
        } catch (err) {
            log(`Error getting fields of view ${viewUuid}: ${err}`);
            return [];
        }
    }

    public createField(viewUuid: string, field: FieldUpsertDto): Promise<Field> {
        let route = ConfigService.ROUTES.FIELDS.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', viewUuid);
        return ConfigService.axiosPost<Field>(route, field, { headers: this.loginService.getAuthorizationHeader() });
    }

    public updateField(viewUuid: string, fieldUuid: string, field: FieldUpsertDto): Promise<Field> {
        let route = ConfigService.ROUTES.FIELD.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', viewUuid).replace('{fieldUuid}', fieldUuid);
        return ConfigService.axiosPut<Field>(route, field, { headers: this.loginService.getAuthorizationHeader() });
    }

    public createView(view: ViewUpsertDto): Promise<View> {
        let route = ConfigService.ROUTES.VIEWS.replace('{activityUuid}', this.activeActivity?.id || '');
        return ConfigService.axiosPost<View>(route, view, { headers: this.loginService.getAuthorizationHeader() });
    }

    public updateView(viewUuid: string, view: ViewUpsertDto): Promise<View> {
        let route = ConfigService.ROUTES.VIEW.replace('{activityUuid}', this.activeActivity?.id || '').replace('{viewUuid}', viewUuid);
        return ConfigService.axiosPut<View>(route, view, { headers: this.loginService.getAuthorizationHeader() });
    }

    public async getDrawings(): Promise<{ drawings: Drawing[] }> {
        let route = ConfigService.ROUTES.DRAWINGS.replace('{activityUuid}', this.activeActivity?.id || '');
        return ConfigService.axiosGet(route, { headers: this.loginService.getAuthorizationHeader() });
    }

    public async getActivities(): Promise<Activity[]> {
        let where: XHeadersActivities = {
            "x-where-name": ConfigService.getConfig().lcms.excercise,
            "x-where-only-own-organization": 'false',
            "x-where-only-not-read": 'false',
            "x-where-category": 'RUNNING',
            "x-order-column": 'modified',
            "x-order-ascending": 'false',
            "x-skip": 0,
            "x-limit": 10
        };
        let headers = { ...where, ...this.loginService.getAuthorizationHeader() };
        return ConfigService.axiosGet<Activity[]>(ConfigService.ROUTES.ACTIVITIES, { headers: headers });
    }

}