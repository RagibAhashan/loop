import { Profile } from '@core/Profile';
import { Proxy } from '@core/Proxy';
import { Status, StatusLevel } from '@interfaces/TaskInterfaces';
import { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { TASK_STOPPED } from '../common/Constants';
import { TASK_STOP } from './../common/Constants';
import { MESSAGES } from './constants/Constants';
import { CookieJar } from './CookieJar';
import { TaskChannel } from './IpcChannels';
import { debug } from './Log';
import { ProfileGroupManager } from './ProfileGroupManager';
import { ProxySet } from './ProxySet';
import { ProxySetManager } from './ProxySetManager';
import { RequestInstance } from './RequestInstance';
import { Viewable } from './Viewable';

export const CANCEL_ERROR = 'Cancel';
const log = debug.extend('Task');

export interface TaskFormData {
    profileName: string;
    proxySetName: string;
    retryDelay: number;
}

export interface TaskViewData {
    uuid: string;
    proxySetName: string;
    profileName: string;
    retryDelay: number;
    status: Status;
    isRunning: boolean;
}

export interface ITask {
    userProfile: Profile;
    proxy: Proxy | null;
    proxySet: ProxySet | null;
    isRunning: boolean;
    status: Status;
    taskGroupId: string;
    retryDelay: number;
    uuid: string;
}

export abstract class Task extends EventEmitter implements ITask, Viewable<TaskViewData> {
    protected requestInstance: RequestInstance;
    protected cookieJar!: CookieJar;
    protected cancel: boolean;
    protected cancelTimeout: () => void;
    protected axiosSession: AxiosInstance;
    protected profileGroupManager: ProfileGroupManager;
    protected proxyManager: ProxySetManager;

    public uuid: string;
    public userProfile: Profile;
    public proxy: Proxy | null;
    public proxySet: ProxySet | null;
    public isRunning: boolean;
    public status: Status;
    public taskGroupId: string;
    public retryDelay: number;

    constructor(
        uuid: string,
        retryDelay: number,
        userProfile: Profile,
        proxySet: ProxySet,
        proxy: Proxy,
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
        this.uuid = uuid;
        this.profileGroupManager = profileGroupManager;
        this.proxyManager = proxyManager;
        this.taskGroupId = taskGroupId;
        this.retryDelay = retryDelay;
        this.status = { level: 'idle', message: 'Idle' };
        this.proxySet = proxySet;
        this.proxy = proxy;
        this.userProfile = userProfile;
    }

    abstract doTask(): void;

    // Return a simple interface to be send to the view
    public getViewData(): TaskViewData {
        return {
            proxySetName: this.proxySet.name,
            uuid: this.uuid,
            retryDelay: this.retryDelay,
            profileName: this.userProfile.profileName,
            status: this.status,
            isRunning: this.isRunning,
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
