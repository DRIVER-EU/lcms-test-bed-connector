import { Logger, IAdapterMessage } from 'node-test-bed-adapter';
import { BaseHandler } from './BaseHandler';
import { stringify } from '../util';
import { ActivityService } from '../lcms/ActivityService';
import { ICAPAlert, ISender, ICAPArea, IValueNamePair } from '../models/cap';
import { FieldUpsertDto, ViewUpsertDto, View, ViewHeader } from 'declarations/lcms-api-schema';

const log = Logger.instance;

export class CapHandler extends BaseHandler {

    private activityService: ActivityService;

    constructor(senderId: string) {
        super(senderId);
        this.activityService = ActivityService.getInstance();
    }

    public handleMessage(message: IAdapterMessage) {
        if (message.key && typeof message.key === 'object' && message.key.senderID === this.senderId) {
            return; //Skip own messages
        }
        log.info(`CapHandler received ${stringify(message.value)}`);
        const msg: ICAPAlert = message.value as ICAPAlert;
        const sender: ISender | undefined = this.getSender(msg);
        if (!sender) return;
        switch (sender.tool) {
            case 'crisissuite.nl':
            case 'crisissuite.com':
                this.publishToLCMS(sender, msg);
                break;
            case 'tmt.eu':
                this.publishToLCMS(sender, msg);
                break;
            default:
                log.info(`Unknown sender: ${sender.organisation} - ${sender.tool}`);
        }
    }

    private getSender(msg: ICAPAlert): ISender | undefined {
        if (!msg || !msg.sender) {
            log.warn(`No sender found in cap message!`);
            return;
        }
        let sender: ISender = {} as ISender;
        let organisation: string = msg.sender.toLocaleLowerCase();
        if (organisation.indexOf('@') > 0) {
            const splitted = organisation.split('@');
            sender.organisation = splitted[0].toLocaleUpperCase();
            sender.tool = splitted[1];
            return sender;
        } else {
            log.warn(`Invalid sender found in cap message, should be an e-mail address`);
            return;
        }
    }

    private publishToLCMS(sender: ISender, msg: ICAPAlert) {
        const contents: FieldUpsertDto[] = this.getCAPParameterValues(msg, sender.organisation);
        const geo: string = this.getGeoFromCAP(msg, sender.organisation);
        if (sender.organisation && contents) {
            contents.forEach(c => (c.content = `${sender.organisation}: ${c.content}${geo ? '\n\nLocation: ' + geo : ''}`));
            this.sendToLCMS(sender.organisation, contents);
        }
    }

    private getGeoFromCAP(msg: ICAPAlert, organisation: string): string {
        if (organisation === 'NO-REPLY') return '';
        let result = '';
        if (!msg || !msg.info || !msg.info.area) {
            return result;
        }
        const area: ICAPArea = msg.info.area;
        if (area.circle) result += `Circle: ${area.circle}`;
        if (area.polygon) result += `Polygon: ${area.polygon}`;
        if (area.areaDesc) result += `\n\nDescription: ${area.areaDesc}`;
        return result;
    }

    private createFieldUpsertDto(title: string, content: string, description: string, read: boolean = false, ): FieldUpsertDto {
        return { title: title, content: content, description: description, setActivityRead: read };
    }

    private getCAPParameterValues(msg: ICAPAlert, organisation: string): FieldUpsertDto[] {
        const result: FieldUpsertDto[] = [];
        if (organisation === 'NO-REPLY') return result;
        if (!msg || !msg.info) {
            result.push(this.createFieldUpsertDto(`Empty message from ${organisation}`, `Empty message from ${organisation}`, `Empty message from ${organisation}`));
        } else if (Array.isArray(msg.info) && msg.info.length > 0) {
            msg.info = msg.info[0];
            console.warn('WARN: Only using first Info field!');
        }
        if (!msg || !msg.info || !msg.info.parameter) {
            result.push(this.createFieldUpsertDto(`Empty message from ${organisation}`, `Empty message from ${organisation}`, `Empty message from ${organisation}`));
        } else {
            const parameter: IValueNamePair | IValueNamePair[] = msg.info.parameter;
            if (Array.isArray(parameter) && parameter.length > 0) {
                parameter.forEach(p => {
                    result.push(this.createFieldUpsertDto(p.valueName, p.value, p.valueName));
                });
            } else {
                result.push(this.createFieldUpsertDto(parameter.valueName, parameter.value, parameter.valueName));
            }
        }
        return result;
    }

    private async sendToLCMS(tab: string, contents: FieldUpsertDto[]) {
        log.info(`Sending ${contents.length} contents to LCMS`);
        const views = await this.activityService.getViews();
        let view = views.find(v => v.screenTitle.toLocaleUpperCase() === tab.toLocaleUpperCase());
        if (!view) {
            log.info(`Creating view ${tab}`);
            view = await this.createView(tab);
        }
        if (!view) {
            return;
        }
        const fields = await this.activityService.getFieldsByViewId(view.uuid);
        contents.forEach(async (content: FieldUpsertDto) => {
            let field = fields.find(f => f.screenTitle.toLocaleUpperCase() === content.title.toLocaleUpperCase());
            if (!field) {
                log.info(`Creating field ${content.title}`);
                field = await this.activityService.createField(view!.uuid, content);
            } else {
                log.info(`Updating field ${content.title}`);
                field = await this.activityService.updateField(view!.uuid, field.uuid, content);
            }
        });
    }

    private async createView(title: string) {
        const input = {} as ViewUpsertDto;
        const view = await this.activityService.getViewByName('politiezorg');
        if (!view) {
            log.warn(`No view found with name ${'politiezorg'}`);
            return;
        }
        input.screenTitle = title;
        input.category = "EXTERNAL";
        input.header = JSON.stringify(view.header) as any as ViewHeader;
        input.visible = true;
        return this.activityService.createView(input);
    }


    // } else if (organisation.indexOf('action@tmt.eu') >= 0) {
    //     organisation = organisation.replace('@tmt.eu', '').toUpperCase();
    //     let contents: ILCMSContent[] = this.getCAPParameterValues(msg, organisation);
    //     if (contents && Array.isArray(contents)) contents = contents.filter(c => c.fieldTitle === '_actions');
    //     if (organisation && contents && contents.length > 0) this.publishToLCMS(contents);
    // } else if (organisation.indexOf('@tmt.eu') > 0) {
    //     organisation = organisation.replace('@tmt.eu', '').toUpperCase();
    //     const contents: ILCMSContent[] = this.getCAPParameterValues(msg, organisation);
    //     const geo: string = this.getGeoFromCAP(msg, organisation);
    //     if (organisation && contents) {
    //         contents.forEach(c => (c.content = `${c.content}${geo ? '\n\nLocation: ' + geo : ''}`));
    //         this.publishToLCMS(contents);
    //     }
    // } else if (organisation.indexOf('@lcms.com') > 0) {
    //     organisation = organisation.replace('@lcms.com', '').toUpperCase();
    //     // const contents: ILCMSContent[] = this.getCAPParameterValues(msg, organisation);
    //     // if (organisation && contents) this.publishToLCMS(contents);
    // } else {
    //     organisation = organisation.toUpperCase();
    // }
    //     }

}
