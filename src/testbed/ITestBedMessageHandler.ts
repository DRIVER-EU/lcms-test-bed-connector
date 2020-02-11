import { IAdapterMessage } from 'node-test-bed-adapter';

export interface ITestBedMessageHandler {
    register(topic: string): void;
    handleMessage(message: IAdapterMessage): string | void;
}