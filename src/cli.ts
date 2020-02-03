import { Server } from './server';

const commandLineArgs = require('command-line-args');

export interface ICommandLineOptions {
  /**
   * Show help information.
   * 
   * @type {boolean}
   * @memberOf ICommandLineOptions
   */
  help: boolean;
  /**
   * Optional username, overrides the one in config.json
   * 
   * @type {string}
   * @memberOf ICommandLineOptions
   */
  username: string;
  /**
   * Password for the LCMS service.
   * 
   * @type {string}
   * @memberOf ICommandLineOptions
   */
  password: string;
  /**
   * The LCMS profile to use (e.g. VR015 or VR099) may be overriden on the command line
   *
   * @type {string}
   */
  profile: string;
  /**
   * The name of the excercise
   * 
   * @type {string}
   * @memberOf ICommandLineOptions
   */
  excercise: string;
  /**
   * Location of the LCMS server gateway (e.g. http://localhost:3000/api)
   *
   * @type {string}
   */
  serverAddress: string;
  /**
   * Name of the LCMS server in the gateway (e.g. "LCMS VR OEFEN")
   *
   * @type {string}
   */
  serverId: string;
  /**
   * Refresh time in seconds
   * 
   * @type {number}
   * @memberOf ICommandLineOptions
   */
  refresh: number;
  /**
   * Use the debug mode
   * 
   * @type {boolean}
   * @memberOf ICommandLineOptions
   */
  debug: boolean;
}

export class CommandLineInterface {
  static optionDefinitions = [
    { name: 'help', alias: '?', type: Boolean, multiple: false, typeLabel: 'Help', description: 'Display help information.' },
    { name: 'refresh', alias: 'r', type: Number, multiple: false, typeLabel: 'Refresh time', description: 'Refresh time in seconds (default 0 = no refresh).' },
    {
      name: 'excercise', alias: 'e', type: String, multiple: false, typeLabel: 'Name of the selected excercise',
      description: 'Only load the data from the selected excercise. If omitted, show active excercises. Case sensitive.'
    },
    { name: 'username', alias: 'u', type: String, multiple: false, typeLabel: 'Username', description: 'If given, overrides the name specified in config.json.' },
    { name: 'password', alias: 'p', type: String, multiple: false, typeLabel: 'Password', description: 'LCMS password for the user (as specified in config.json).' },
    { name: 'debug', alias: 'd', type: Boolean, multiple: false, typeLabel: 'Use debug mode', description: 'Write debug output to files.' },
    { name: 'server', alias: 's', type: String, multiple: false, default: 'http://localhost:3000/api', typeLabel: 'Server URL', description: 'Provide the URL of the LCMS-gateway.' }
  ];

  static sections = [{
    header: 'LCMS connector',
    content: 'Connect to the Dutch LCMS (Landelijk Crisis Management System) and connect it to the DRIVER+ Test-bed based on Apache Kafka.'
  }, {
    header: 'Options',
    optionList: CommandLineInterface.optionDefinitions
  }, {
    header: 'Example',
    content: `Send the data every minute to Kafka (using the details in config.json):
    >> lcms_connector -p YOUR_PASSWORD -e "Excercise name" -r 60`
  }];
}

let options: ICommandLineOptions = commandLineArgs(CommandLineInterface.optionDefinitions);

if (options.help) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(1);
}

if (!options || typeof options !== 'object') options = <ICommandLineOptions>{};

const server = new Server(options);
