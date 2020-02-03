import {ITestBedOptions} from 'node-test-bed-adapter';

/**
 * Configuration file
 *
 * @export
 * @interface IConfig
 */
export interface IConfig {
  /**
   * If true, start tool in server mode.
   * Otherwise, send the LCMS information once, then quit.
   *
   * @type {boolean}
   * @memberOf IConfig
   */
  serverMode?: boolean;
  /**
   * If true, show more debug output.
   *
   * @type {boolean}
   * @memberOf IConfig
   */
  debugMode?: boolean;
  /**
   * If set, refresh the data every 'refreshTime' seconds.
   *
   * @type {number}
   * @memberOf IConfig
   */
  refreshTime?: number;
  /**
   * LCMS connection settings
   *
   * @type {{
   *     username: string;
   *     serverUrl: string;
   *     path: string;
   *   }}
   * @memberOf IConfig
   */
  lcms: {
    /**
     * The LCMS username may be overriden on the command line
     *
     * @type {string}
     */
    username: string;
    /**
     * The LCMS password may be overriden on the command line
     *
     * @type {string}
     */
    password: string;
    /**
     * The LCMS profile to use (e.g. VR015 or VR099) may be overriden on the command line
     *
     * @type {string}
     */
    profile: string;
    /**
     * The LCMS excercise may be overriden on the command line
     *
     * @type {string}
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
     * Refresh interval for checking for changes on the LCMS server in seconds
     *
     * @type {number}
     */
    refreshTime: number;
    /**
     * Disciplines of the LCMS activity to publish on CAP
     * (provide titles in full CAPS)
     *
     * @type {string[]}
     */
    consumeDisciplines: string[];
  };
  testbed?: {
    sslOptions: {
      passphrase: string;
      ca: string;
      rejectUnauthorized: boolean;
      pfx?: string;
      cert?: string;
      key?: string;
    };
  };
  kafka?: {
    zookeeperUrl: string;
    clientID: string;
    topicPrefix: string;
    testbedOptions?: ITestBedOptions;
    plotTopic: string;
    capTopic: string;
  };
  folder?: {
    data: string;
    images: string;
  };
}
