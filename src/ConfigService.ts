import * as yn from 'yn';
import * as fs from 'fs';
import * as path from 'path';
import { IConfig } from "./models/config";
import { ICommandLineOptions } from './cli';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class ConfigService {

    private static config: IConfig = {} as IConfig;
    private static axiosInstance: AxiosInstance;

    public static ROUTES = {
        LOGIN: '/auth/login',
        WHOAMI: '/auth/whoami',
        TOKEN_REFRESH: '/auth/refresh-token',
        PROFILES: '/profiles',
        ACTIVITIES: '/activities',
        VIEWS: '/activities/{activityUuid}/views'
    }

    public static parse(): void {
        ConfigService.assertFiles();
        const localConfig: IConfig = require(path.resolve('./local/config.json'));
        const publicConfig: IConfig = require(path.resolve('config.json'));
        const config: IConfig = Object.assign(publicConfig, localConfig);
        const disableSSL: boolean = !!(process.env.LCMS_CONNECTOR_SSL_MODE && yn(process.env.LCMS_CONNECTOR_SSL_MODE) === false);
        if (config.testbed && config.testbed.sslOptions && config.kafka && config.kafka.testbedOptions && !disableSSL) {
            config.kafka.testbedOptions.sslOptions = {
                passphrase: config.testbed.sslOptions.passphrase,
                pfx: config.testbed.sslOptions.pfx ? fs.readFileSync(config.testbed.sslOptions.pfx) : undefined,
                cert: config.testbed.sslOptions.cert ? fs.readFileSync(config.testbed.sslOptions.cert) : undefined,
                ca: config.testbed.sslOptions.ca ? fs.readFileSync(config.testbed.sslOptions.ca) : new Buffer(''),
                rejectUnauthorized: config.testbed.sslOptions.rejectUnauthorized
            };
            console.log('Using SSL config to connect to testbed');
        }
        this.config = config;
    }

    public static updateConfig(options?: ICommandLineOptions) {
        if (!options || !this.config) return;
        this.config.lcms.username = process.env.LCMS_CONNECTOR_USERNAME || options.username;
        this.config.lcms.password = process.env.LCMS_CONNECTOR_PASSWORD || options.password;
        this.config.lcms.excercise = process.env.LCMS_CONNECTOR_EXCERCISE || options.excercise;
        this.config.lcms.profile = process.env.LCMS_CONNECTOR_PROFILE || options.profile;
        this.config.lcms.serverAddress = process.env.LCMS_CONNECTOR_SERVER_ADDRESS || options.serverAddress;
        this.config.lcms.serverId = process.env.LCMS_CONNECTOR_SERVER_ID || options.serverId;
        this.config.lcms.refreshTime = +(process.env.LCMS_CONNECTOR_REFRESH_TIME_S || options.refresh);
        console.log('Configuration updated with ENV variables');
        return;
    }

    public static getAxios(): AxiosInstance {
        if (!this.axiosInstance) {
            this.axiosInstance = axios.create({
                baseURL: this.config.lcms.serverAddress
            });
        }
        return this.axiosInstance;
    }

    public static async axiosGet<T>(route: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.getAxios().get<T>(route, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async axiosPost<T>(route: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.getAxios().post<T>(route, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static getKafkaConfig() {
        return this.config.kafka;
    }

    public static getConfig() {
        return this.config;
    }

    private static assertFiles() {
        if (!fs.existsSync('./local')) {
            fs.mkdirSync('./local');
        }
        if (!fs.existsSync('./local/config.json')) {
            fs.writeFileSync('./local/config.json', '{}', 'utf8');
        }
    }
}