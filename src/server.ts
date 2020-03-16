import { ICommandLineOptions } from './cli';
import { DriverTestBedAdapter } from './testbed/DriverTestBedAdapter';
import { ConfigService } from './ConfigService';
import { LcmsAdapter } from './lcms/LcmsAdapter';

const log = console.log;
const error = console.error;

export class Server {

    private adapter: DriverTestBedAdapter;
    private LCMS: LcmsAdapter;

    constructor(options?: ICommandLineOptions) {
        log('Starting...');
        process.on('SIGINT', () => {
            process.exit(0);
        });
        ConfigService.parse();
        ConfigService.updateConfig(options);
        this.adapter = new DriverTestBedAdapter(ConfigService.getKafkaConfig()?.testbedOptions);
        this.LCMS = new LcmsAdapter();
    }

}
