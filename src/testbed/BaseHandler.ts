import { Logger, IAdapterMessage } from 'node-test-bed-adapter';
import { ITestBedMessageHandler } from "./ITestBedMessageHandler";

const log = Logger.instance;

export abstract class BaseHandler implements ITestBedMessageHandler {
    protected senderId: string;

    constructor(id: string) {
        this.senderId = id;
    }

    public register(topic: string): void {
        log.info(`${this.constructor.name} will handle messaged on topic ${topic}`);
    }

    public abstract handleMessage(msg: IAdapterMessage): string | void;
}
