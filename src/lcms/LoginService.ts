import { ConfigService } from "../ConfigService";
import { TokenBundle, AuthUserDto, Profile, LcmsGetMyUserInfoResponseDto } from "declarations/lcms-api-schema";

const log = console.log;

export class LoginService {

    private static instance: LoginService;
    private isLoggedIn: boolean = false;
    private activeToken?: TokenBundle;

    private constructor() { }

    public static getInstance(): LoginService {
        if (!LoginService.instance) {
            LoginService.instance = new LoginService();
        }
        return LoginService.instance;
    }

    public getBearerToken(): string {
        return `Bearer ${this.activeToken?.accessToken.token}`;
    }

    public getAuthorizationHeader() {
        return { Authorization: this.getBearerToken() };
    }

    public async login(): Promise<boolean> {
        try {
            this.activeToken = await this.loginWithoutProfile();
            const profiles = await this.getProfiles();
            const selectedProfileId = this.selectProfile(profiles);
            this.activeToken = await this.loginWithProfile(selectedProfileId);
            this.scheduleTokenRefresh();
            this.isLoggedIn = true;
        } catch (error) {
            this.isLoggedIn = false;
            console.error(error.stack);
            throw new Error(`Could not login`);
        } finally {
            return this.isLoggedIn;
        }
    }

    public async loginWithoutProfile(): Promise<TokenBundle> {
        let { username, password, serverId } = ConfigService.getConfig().lcms;
        return ConfigService.axiosPost<TokenBundle>(ConfigService.ROUTES.LOGIN, { username, password, server: serverId } as AuthUserDto);
    }

    public async loginWithProfile(profileId: string): Promise<TokenBundle> {
        let { username, password, serverId } = ConfigService.getConfig().lcms;
        return ConfigService.axiosPost<TokenBundle>(ConfigService.ROUTES.LOGIN, { username, password, server: serverId, profileId } as AuthUserDto);
    }

    public async getProfiles(): Promise<Profile[]> {
        if (!this.activeToken || !this.activeToken.accessToken)
            throw new Error(`No active token. Login first`);
        return ConfigService.axiosGet<Profile[]>(ConfigService.ROUTES.PROFILES, { headers: { Authorization: this.getBearerToken() } });
    }

    private selectProfile(profiles: Profile[]): string {
        const profileKey = ConfigService.getConfig().lcms.profile;
        let selectedProfile = profiles.find(p => p.organisation && p.organisation.displayName.indexOf(profileKey) >= 0);
        if (!selectedProfile && profiles.length > 0) selectedProfile = profiles[0];
        if (!selectedProfile)
            throw new Error(`Selected profile ${profileKey} not found`);
        log(`Selected profile ${selectedProfile.organisation.displayName}`);
        return selectedProfile.id;
    }

    public async whoAmI(): Promise<LcmsGetMyUserInfoResponseDto> {
        return ConfigService.axiosGet<LcmsGetMyUserInfoResponseDto>(ConfigService.ROUTES.WHOAMI, { headers: { Authorization: this.getBearerToken() } });
    }

    private scheduleTokenRefresh() {
        const expirationMillis = (+(this.activeToken?.accessToken.expiresIn || 1200) - 10) * 1000;
        log(`Schedule token refresh in ${expirationMillis / 1000} seconds.`);
        setTimeout(async () => {
            log(`Refreshing token...`);
            try {
                this.activeToken = await ConfigService.axiosPost(ConfigService.ROUTES.TOKEN_REFRESH, this.activeToken);
                this.scheduleTokenRefresh();
                log(`Token refreshed`);
            } catch (error) {
                console.error(`Error refreshing token. Retrying in 5 seconds...`);
                console.error(error.stack);
                this.isLoggedIn = false;
                setTimeout(() => {
                    this.scheduleTokenRefresh();
                }, 5000);
            }
        }, expirationMillis);
    }
}