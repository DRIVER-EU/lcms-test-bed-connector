import { TestBedAdapter, Logger, IAdapterMessage, ProduceRequest, ITestBedOptions } from 'node-test-bed-adapter';

const log = Logger.instance;

export class DriverTestBedAdapter {
  private id = 'lcms-testbed-adapter';
  private adapter: TestBedAdapter;

  constructor(testbedOptions?: ITestBedOptions) {
    this.adapter = new TestBedAdapter(testbedOptions);
    this.adapter.on('ready', () => {
      this.subscribe();
      log.info('LCMS-adapter is connected to the test-bed');
    });
    this.adapter.connect();
  }

  private subscribe() {
    this.adapter.on('message', message => this.handleMessage(message));
    this.adapter.on('error', e => console.error(e));
    this.adapter.on('offsetOutOfRange', err => {
      console.error(`Consumer received an offsetOutOfRange error on topic ${err.topic}.`);
    });
  }

  private handleMessage(message: IAdapterMessage) {
    const stringify = (m: string | Object) => (typeof m === 'string' ? m : JSON.stringify(m, null, 2));
    switch (message.topic.toLowerCase()) {
      case 'system_heartbeat':
        log.info(`Received heartbeat message with key ${stringify(message.key)}: ${stringify(message.value)}`);
        break;
      case 'standard_cap':
        log.info(`Received CAP message with key ${stringify(message.key)}: ${stringify(message.value)}`);
        break;
      default:
        log.info(`Received ${message.topic} message with key ${stringify(message.key)}: ${stringify(message.value)}`);
        break;
    }
  }

  /** Will only work if you are authorized to send CAP messages. */
  public sendCap(payloads: ProduceRequest[]) {
    this.adapter.send(payloads, (error, data) => {
      if (error) {
        log.error(error);
      }
      if (data) {
        log.info(data);
      }
    });
  }
}
