import { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { TASK_STOPPED } from '../common/Constants';
import { TASK_STATUS, TASK_STOP } from './../common/Constants';
import { MESSAGES } from './constants/Constants';
import { CookieJar } from './CookieJar';
import { RequestInstance } from './RequestInstance';

export const CANCEL_ERROR = 'Cancel';
export abstract class Task extends EventEmitter {
    protected requestInstance: RequestInstance;
    protected cookieJar: any;
    protected cancel: boolean;
    protected cancelTimeout: () => void;
    protected uuid: string;
    protected axiosSession: AxiosInstance;

    constructor(uuid: string, requestInstance: RequestInstance) {
        super();
        this.requestInstance = requestInstance;
        this.axiosSession = requestInstance.axios;
        this.cookieJar = new CookieJar();
        this.cancel = false;
        this.cancelTimeout = () => {};
        this.uuid = uuid;
    }

    updateProxy(proxyData: any): void {
        this.requestInstance.updateProxy(proxyData);
    }

    abstract doTask(): void;

    async execute(): Promise<void> {
        try {
            // Cancel logic, TODO put this in function
            this.cancel = false;
            this.once(TASK_STOP, async () => {
                this.cancel = true;
                this.emit(TASK_STATUS, { message: MESSAGES.CANCELED_MESSAGE, level: 'cancel' });
                this.requestInstance.cancel();
                this.cancelTimeout();
            });

            await this.doTask();
        } catch (err) {
            // console.log('execute error', err);
            // waitError cancel would reject promise so error could equal to CANCEL_ERROR
            this.emit(TASK_STOPPED);
            // do nothing
        }
    }
}
