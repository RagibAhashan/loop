import { Profile } from '@core/profile';
import { Status, StatusLevel } from '@interfaces/TaskInterfaces';
import { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { TASK_STOP, TASK_STOPPED } from '../common/Constants';
import { Account } from './account';
import { MESSAGES } from './constants/Constants';
import { CookieJar } from './cookie-jar';
import { TaskChannel } from './ipc-channels';
import { debug } from './log';
import { ProfileGroupManager } from './profilegroup-manager';
import { Proxy } from './proxy';
import { ProxySet } from './proxyset';
import { ProxySetManager } from './proxyset-manager';
import { RequestInstance } from './request-instance';
import { Viewable } from './viewable';

export const CANCEL_ERROR = 'Cancel';

export const taskPrefix = 'task';

const log = debug.extend('Task');

export interface TaskFormData {
    profileName: string;
    proxySetName: string;
    retryDelay: number;
    id: string;
}

export interface TaskViewData {
    id: string;
    productIdentifier: string; // can be either SKU, URL, etc
    accountName: string;
    proxySetName: string;
    profileName: string;
    retryDelay: number;
    status: Status;
    isRunning: boolean;
}

export interface ITask {
    id: string;
    retryDelay: number;
    productIdentifier: string;
    userProfile: Profile;
    proxySet: ProxySet | null;
    account: Account | null;
    productQuantity: number;
    isRunning: boolean;
    status: Status;
    taskGroupId: string;
}

export abstract class Task extends EventEmitter implements ITask, Viewable<TaskViewData> {
    protected requestInstance: RequestInstance;
    protected cookieJar!: CookieJar;
    protected cancel: boolean;
    protected cancelTimeout: () => void;
    protected axiosSession: AxiosInstance;
    protected profileGroupManager: ProfileGroupManager;
    protected proxyManager: ProxySetManager;
    protected proxy: Proxy;

    public id: string;
    public userProfile: Profile;
    public productIdentifier: string;
    public proxySet: ProxySet | null;
    public account: Account | null;
    public isRunning: boolean;
    public status: Status;
    public taskGroupId: string;
    public retryDelay: number;
    public productQuantity: number;

    constructor(
        id: string,
        retryDelay: number,
        productIdentifier: string,
        userProfile: Profile,
        proxySet: ProxySet | null,
        account: Account | null,
        productQuantity: number,
        taskGroupId: string,
        requestInstance: RequestInstance,
        profileGroupManager: ProfileGroupManager,
        proxyManager: ProxySetManager,
    ) {
        super();
        this.requestInstance = requestInstance;
        this.axiosSession = requestInstance.axios;
        this.cancel = false;
        this.cancelTimeout = () => {};
        this.id = id;
        this.profileGroupManager = profileGroupManager;
        this.proxyManager = proxyManager;
        this.taskGroupId = taskGroupId;
        this.retryDelay = retryDelay;
        this.status = { level: 'idle', message: 'Idle' };
        this.proxySet = proxySet;
        this.productIdentifier = productIdentifier;
        this.account = account;
        this.userProfile = userProfile;
        this.productQuantity = productQuantity;
    }

    public async doTask(): Promise<void> {
        if (this.proxySet) {
            this.proxy = this.proxyManager.pickProxyFromSet(this.proxySet.id);
        }
    }

    // Return a simple interface to be send to the view
    public getViewData(): TaskViewData {
        return {
            proxySetName: this.proxySet.name,
            id: this.id,
            retryDelay: this.retryDelay,
            profileName: this.userProfile.profileName,
            status: this.status,
            isRunning: this.isRunning,
            productIdentifier: this.productIdentifier,
            accountName: this.account.name,
        };
    }

    protected handleCancel(): void {
        this.cancel = false;
        this.once(TASK_STOP, async () => {
            log('Cancelling Task');
            this.cancel = true;
            this.emitStatus(MESSAGES.CANCELED_MESSAGE, 'cancel');
            this.requestInstance.cancel();
            this.cancelTimeout();
            this.isRunning = false;
        });
    }

    protected cancelTask(): void {
        if (this.cancel) throw new Error(CANCEL_ERROR);
    }

    protected emitStatus(message: string, level: StatusLevel): void {
        this.status = { message: message, level: level };
        this.emit(TaskChannel.onTaskStatus, this.status);
    }

    protected async emitStatusWithDelay(message: string, level: StatusLevel, delay?: number): Promise<any> {
        this.status = { message: message, level: level };
        this.emit(TaskChannel.onTaskStatus, this.status);
        const wait = this.waitError(delay ? delay : this.retryDelay);
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

    protected waitForCaptcha(): { promise: any; cancel: any } {
        let cancel;

        const promise = new Promise((resolve, reject) => {
            this.once(TaskChannel.onCaptchaSolved, () => {
                resolve(`${this.constructor.name} captcha solved by user`);
            });

            cancel = () => {
                this.cancelTimeout = () => {};
                reject(CANCEL_ERROR);
            };
        });

        return { promise: promise, cancel: cancel };
    }

    async execute(): Promise<void> {
        try {
            this.handleCancel();
            this.isRunning = true;
            await this.doTask();
            this.isRunning = false;
        } catch (err) {
            // waitError cancel would reject promise so error could equal to CANCEL_ERROR
            this.emit(TASK_STOPPED);
            console.log('EXECUTE ERROR', err);
            this.isRunning = false;
        }
    }
}
