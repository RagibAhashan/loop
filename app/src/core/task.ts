import { Profile } from '@core/profile';
import { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { Account } from './account';
import { MESSAGES } from './constants/Constants';
import { CookieJar } from './cookie-jar';
import { Status } from './interfaces/base';
import { debug } from './log';
import { Proxy } from './proxy';
import { ProxyGroup } from './proxy-group';
import { ProxyGroupStore } from './proxy-group-store';
import { RequestInstance } from './request-instance';
import { Viewable } from './viewable';

export const CANCEL_ERROR = 'Cancel';

export const taskPrefix = 'task';

const log = debug.extend('Task');

export type TaskStatusLevel = 'error' | 'status' | 'info' | 'idle' | 'cancel' | 'success' | 'fail';
export type TaskStatus = Status<TaskStatusLevel>;

export const enum TaskEmittedEvents {
    Stopped = 'stopped',
    Status = 'status',
    Succeeded = 'succeeded',
    Captcha = 'captcha',
    CaptchaSolved = 'captchaSolved',
}

export interface TaskFormData {
    id: string;
    profile: { groupId: string; id: string };
    proxyGroupId: string;
    account: { groupId: string; id: string } | null;
    productIdentifier: string;
    productQuantity: number;
    retryDelay: number;
}

export interface TaskViewData {
    id: string;
    productIdentifier: string; // can be either SKU, URL, etc
    accountName: string;
    proxyGroupName: string;
    profileName: string;
    retryDelay: number;
    status: TaskStatus;
    isRunning: boolean;
}

export interface ITask {
    id: string;
    retryDelay: number;
    productIdentifier: string;
    userProfile: Profile;
    proxyGroup: ProxyGroup | null;
    account: Account | null;
    productQuantity: number;
    isRunning: boolean;
    status: TaskStatus;
    groupId: string;
}

export abstract class Task extends EventEmitter implements ITask, Viewable<TaskViewData> {
    protected requestInstance: RequestInstance;
    protected cookieJar!: CookieJar;
    protected cancel: boolean;
    protected cancelTimeout: () => void;
    protected axiosSession: AxiosInstance;
    protected proxyStore: ProxyGroupStore;

    public proxy: Proxy | null;
    public id: string;
    public userProfile: Profile;
    public productIdentifier: string;
    public proxyGroup: ProxyGroup | null;
    public account: Account | null;
    public isRunning: boolean;
    public status: TaskStatus;
    public groupId: string;
    public retryDelay: number;
    public productQuantity: number;

    constructor(
        id: string,
        retryDelay: number,
        productIdentifier: string,
        userProfile: Profile,
        proxyGroup: ProxyGroup | null,
        account: Account | null,
        productQuantity: number,
        groupId: string,
        requestInstance: RequestInstance,
    ) {
        super();
        this.requestInstance = requestInstance;
        this.axiosSession = requestInstance.axios;
        this.cancel = false;
        this.cancelTimeout = () => {};
        this.id = id;
        this.groupId = groupId;
        this.retryDelay = retryDelay;
        this.status = { level: 'idle', message: 'Idle' };
        this.proxyGroup = proxyGroup;
        this.productIdentifier = productIdentifier;
        this.account = account;
        this.userProfile = userProfile;
        this.productQuantity = productQuantity;
    }

    public async doTask(): Promise<void> {
        if (this.proxyGroup && !this.proxy) {
            this.proxy = this.proxyGroup.pickProxy({ id: this.id, groupId: this.groupId });
        }

        return;
    }

    // Return a simple interface to be send to the view
    public getViewData(): TaskViewData {
        return {
            id: this.id,
            retryDelay: this.retryDelay,
            profileName: this.userProfile.name,
            status: this.status,
            isRunning: this.isRunning,
            productIdentifier: this.productIdentifier,
            proxyGroupName: this.proxyGroup ? this.proxyGroup.name : 'None',
            accountName: this.account ? this.account.name : 'None',
        };
    }

    protected handleCancel(): void {
        this.cancel = false;
        this.once(TaskEmittedEvents.Stopped, async () => {
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

    protected emitStatus(message: string, level: TaskStatusLevel): void {
        this.status = { message: message, level: level };
        this.emit(TaskEmittedEvents.Status, this.status);
    }

    protected async emitStatusWithDelay(message: string, level: TaskStatusLevel, delay?: number): Promise<any> {
        this.status = { message: message, level: level };
        this.emit(TaskEmittedEvents.Status, this.status);
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
            this.once(TaskEmittedEvents.CaptchaSolved, () => {
                resolve(`${this.constructor.name} captcha solved by user`);
            });

            cancel = () => {
                this.cancelTimeout = () => {};
                reject(CANCEL_ERROR);
            };
        });

        return { promise: promise, cancel: cancel };
    }

    public setProxy(value: Proxy | null): void {
        this.proxy = value;
    }

    async execute(): Promise<void> {
        try {
            this.handleCancel();
            this.isRunning = true;
            await this.doTask();
            this.isRunning = false;
        } catch (err) {
            // waitError cancel would reject promise so error could equal to CANCEL_ERROR
            console.log('EXECUTE ERROR', err);
            this.isRunning = false;
        }
    }
}
