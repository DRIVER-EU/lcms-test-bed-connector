import { TestBedAdapter, Logger, IAdapterMessage, ProduceRequest, ITestBedOptions } from 'node-test-bed-adapter';
import { ITestBedMessageHandler } from './ITestBedMessageHandler';
import { LogHandler } from './LogHandler';
import { CapHandler } from './CapHandler';

const log = Logger.instance;

export class DriverTestBedAdapter {
  private id = 'lcms-testbed-adapter';
  private adapter: TestBedAdapter;
  private messageHandlers: Record<string, ITestBedMessageHandler> = {};

  constructor(testbedOptions?: ITestBedOptions) {
    this.registerMessageHandlers();
    this.adapter = new TestBedAdapter(testbedOptions);
    this.adapter.on('ready', () => {
      this.subscribe();
      log.info('LCMS-adapter is connected to the test-bed');
    });
    this.adapter.connect();
  }

  public getId() {
    return this.id;
  }

  private subscribe() {
    this.adapter.on('message', message => this.handleMessage(message));
    this.adapter.on('error', e => console.error(e));
    this.adapter.on('offsetOutOfRange', err => {
      console.error(`Consumer received an offsetOutOfRange error on topic ${err.topic}.`);
    });
  }

  private registerMessageHandlers() {
    const logHandler = new LogHandler(this.id);
    const capHandler = new CapHandler(this.id);
    this.messageHandlers['system_heartbeat'] = logHandler;
    this.messageHandlers['standard_cap'] = capHandler;
  }


  private handleMessage(message: IAdapterMessage) {
    if (this.messageHandlers.hasOwnProperty((message.topic.toLowerCase()))) {
      this.messageHandlers[message.topic.toLowerCase()].handleMessage(message);
    } else {
      log.warn(`Received unhandled ${message.topic} message.`);
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
