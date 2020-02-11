import { Logger, IAdapterMessage } from 'node-test-bed-adapter';
import { BaseHandler } from './BaseHandler';

const log = Logger.instance;

export class LogHandler extends BaseHandler {

    constructor(id: string) {
        super(id);
    }

    public handleMessage(msg: IAdapterMessage) {
        console.log(JSON.stringify(msg));
    }

}
