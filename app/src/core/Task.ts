import { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { TASK_STOPPED } from '../common/Constants';
import { TASK_STATUS, TASK_STOP } from './../common/Constants';
import { StatusLevel, TaskData } from './../interfaces/TaskInterfaces';
import { MESSAGES } from './constants/Constants';
import { CookieJar } from './CookieJar';
import { IProxy } from './Proxy';
import { RequestInstance } from './RequestInstance';

export const CANCEL_ERROR = 'Cancel';

export abstract class Task extends EventEmitter {
    protected requestInstance: RequestInstance;
    protected cookieJar!: CookieJar;
    protected cancel: boolean;
    protected cancelTimeout: () => void;
    protected uuid: string;
    protected axiosSession: AxiosInstance;
    public taskData: TaskData;

    constructor(uuid: string, requestInstance: RequestInstance, taskData: TaskData) {
        super();
        this.requestInstance = requestInstance;
        this.axiosSession = requestInstance.axios;
        this.cancel = false;
        this.cancelTimeout = () => {};
        this.uuid = uuid;
        this.taskData = taskData;
    }

    abstract doTask(): void;

    protected updateProxy(proxyData: IProxy | null): void {
        this.requestInstance.updateProxy(proxyData);
    }

    protected handleCancel(): void {
        this.cancel = false;
        this.on(TASK_STOP, async () => {
            console.log('CANCELLING TASK');
            this.cancel = true;
            this.emit(TASK_STATUS, { message: MESSAGES.CANCELED_MESSAGE, level: 'cancel' });
            this.requestInstance.cancel();
            this.cancelTimeout();
        });
    }

    protected cancelTask(): void {
        if (this.cancel) throw new Error(CANCEL_ERROR);
    }

    protected async emitStatusWithDelay(message: string, level: StatusLevel, delay?: number): Promise<any> {
        this.emit(TASK_STATUS, { message: message, level: level });
        const wait = this.waitError(delay ? delay : this.taskData.retryDelay);
        this.cancelTimeout = wait.cancel;
        // this is is promise not a function
        return wait.promise;
    }

    // This func will return one promise that will act as a sleep for the error message
    // and a cancel sleep so we dont wait the whole retry delay when we cancel our task during an error
    protected waitError(customDelay?: number): { promise: any; cancel: any } {
        let timeout: any, cancel;

        const promise = new Promise((resolve, reject) => {
            timeout = setTimeout(() => {
                resolve('Wait on error done');
            }, customDelay);

            cancel = () => {
                this.cancelTimeout = () => {};
                clearTimeout(timeout);
                reject(CANCEL_ERROR);
            };
        });

        return {
            promise: promise,
            cancel: cancel,
        };
    }

    updateData(taskData: TaskData): void {
        console.log('updated old', this.taskData);
        if (this.taskData.proxy?.host !== taskData.proxy?.host) this.updateProxy(taskData.proxy);
        this.taskData = taskData;
        console.log('updated new', this.taskData, taskData);
    }

    async execute(): Promise<void> {
        try {
            this.handleCancel();

            await this.doTask();
        } catch (err) {
            // waitError cancel would reject promise so error could equal to CANCEL_ERROR
            this.emit(TASK_STOPPED);
            console.log('EXECUTE ERROR', err);
        }
    }
}
