import { ICommandLineOptions } from './cli';
import { DriverTestBedAdapter } from './testbed/DriverTestBedAdapter';
import { ConfigService } from './ConfigService';
import { LcmsAdapter } from './lcms/LcmsAdapter';

const log = console.log;
const error = console.error;

export class Server {

    constructor(options?: ICommandLineOptions) {
        log('Starting...');
        process.on('SIGINT', () => {
            process.exit(0);
        });
        ConfigService.parse();
        ConfigService.updateConfig(options);
        this.startServices();
    }

    private async startServices() {
        const adapter = DriverTestBedAdapter.getInstance();
        const lcms = LcmsAdapter.getInstance();
        const inits: Promise<boolean>[] = [];
        inits.push(lcms.init());
        inits.push(adapter.init(ConfigService.getKafkaConfig()?.testbedOptions));
        try {
            const initialized = await Promise.all(inits);
            lcms.start();
            adapter.start();
            log(`Started lcms and test-bed services`);
        } catch (error) {
            log(`Error starting service: ${error}`);
        }
    }
}
