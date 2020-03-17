import { TestBedAdapter, Logger, IAdapterMessage, ProduceRequest, ITestBedOptions } from 'node-test-bed-adapter';
import { ITestBedMessageHandler } from './ITestBedMessageHandler';
import { LogHandler } from './LogHandler';
import { CapHandler } from './CapHandler';
import { InitStartService } from 'src/lcms/InitStartService';
import { ICAPAlert, ICAPInfo } from 'src/models/cap';
import { INamedGeoJSON } from 'src/models/named-geojson';
import { FeatureCollection, Geometry } from 'geojson';
import { hash, wrapUnionFieldsOfProperties, ConfigService } from '../index';

const log = Logger.instance;

export class DriverTestBedAdapter implements InitStartService {
  private static instance: DriverTestBedAdapter;
  private id = 'lcms-testbed-adapter';
  private adapter?: TestBedAdapter;
  private messageHandlers: Record<string, ITestBedMessageHandler> = {};
  private messageQueue: IAdapterMessage[] = [];
  private _isStarted: boolean = false;
  private hashes: { [key: string]: number } = {};

  private constructor() { }

  public static getInstance(): DriverTestBedAdapter {
    if (!DriverTestBedAdapter.instance) {
      DriverTestBedAdapter.instance = new DriverTestBedAdapter();
    }
    return DriverTestBedAdapter.instance;
  }

  public async init(testbedOptions?: ITestBedOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.registerMessageHandlers();
      this.adapter = new TestBedAdapter(testbedOptions);
      this.adapter.on('ready', () => {
        this.subscribe();
        log.info('LCMS-adapter is connected to the test-bed');
        resolve(true);
      });
      this.adapter.connect();
    });
  }

  public async start() {
    this._isStarted = true;
    this.processQueue();
  }

  public getId() {
    return this.id;
  }

  private subscribe() {
    if (!this.adapter) return log.warn(`Cannot find a testbed adapter!`);
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

  private processQueue() {
    if (!this._isStarted) return;
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.handleMessage(message!, true);
    }
  }

  private handleMessage(message: IAdapterMessage, fromQueue: boolean = false) {
    if (!this._isStarted) {
      this.messageQueue.push(message);
    } else {
      if (!fromQueue) this.processQueue();
      if (this.messageHandlers.hasOwnProperty((message.topic.toLowerCase()))) {
        this.messageHandlers[message.topic.toLowerCase()].handleMessage(message);
      } else {
        log.warn(`Received unhandled ${message.topic} message.`);
      }
    }
  }

  public sendCAPMessage(caps: ICAPAlert[]) {
    const payloads: ProduceRequest[] = [];
    caps.forEach(capData => {
      const capContent = capData.info;
      const key = capContent.headline || '';
      if (this.hasChanged(key, capContent)) {
        console.log(`Sending changed CAP-content: ${key}`);
        const payload = this.createProduceRequest(ConfigService.getKafkaConfig().capTopic, capData);
        if (payload) payloads.push(payload);
      } else {
        console.log(`Skipping unchanged CAP-content: ${key}`);
      }
    });
    if (payloads.length > 0) {
      log.info(`Sending ${payloads.length} payloads to kafka`);
      this.sendCap(payloads);
    }
  }

  /** Will only work if you are authorized to send CAP messages. */
  private sendCap(payloads: ProduceRequest[]) {
    if (!this.adapter) return log.warn(`Cannot find a testbed adapter to send the payload!`);
    this.adapter.send(payloads, (error, data) => {
      if (error) {
        log.error(error);
      }
      if (data) {
        log.info(data);
      }
    });
  }

  private hasChanged(key: string, data: INamedGeoJSON | ICAPInfo) {
    if (!data) return false;
    let hashData = hash(data);
    log.debug(`Hashes: ${JSON.stringify(this.hashes)}`);
    if (!this.hashes.hasOwnProperty(key)) {
      // new data
      log.info(`Create hash for ${key}: ${hashData}`);
      return true;
    } else if (this.hashes[key] !== hashData) {
      // changed data
      this.hashes[key] = hashData;
      log.info(`Update hash for ${key}: ${hashData}`);
      return true;
    } else {
      // unchanged data
      log.info(`Unchanged hash for ${key}: ${hashData}`);
      return false;
    }
  }

  private createProduceRequest(topic: string, data?: INamedGeoJSON | ICAPAlert): ProduceRequest | undefined {
    if (!data) return undefined;
    if (data.hasOwnProperty('geojson') && (data as INamedGeoJSON).geojson.hasOwnProperty('features')) {
      this.wrapUnionFieldsOfGeojson((data as INamedGeoJSON).geojson);
    }
    if (data.hasOwnProperty('properties')) {
      wrapUnionFieldsOfProperties((data as INamedGeoJSON).properties);
    }
    const payload: ProduceRequest = {
      topic: topic,
      partition: 0,
      messages: data,
      attributes: 1
    };
    return payload;
  }

  private wrapUnionFieldsOfGeojson(data: FeatureCollection | ICAPAlert) {
    if (!data) return;
    if (data.hasOwnProperty('features')) {
      const geoJson = data as FeatureCollection;
      geoJson.features.forEach(f => {
        if (f && f.geometry && f.geometry && Object.keys(f.geometry).length > 1) {
          const geom = JSON.parse(JSON.stringify(f.geometry));
          delete f.geometry;
          f.geometry = {} as Geometry;
          (f.geometry as Geometry & { [key: string]: Geometry })[`eu.driver.model.geojson.${geom.type}`] = geom;
        }
        wrapUnionFieldsOfProperties(f.properties);
      });
    }
  }
}
