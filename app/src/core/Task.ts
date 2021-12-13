import { Profile } from '@core/Profile';
import { Proxy } from '@core/Proxy';
import { Status, StatusLevel, TaskData } from '@interfaces/TaskInterfaces';
import { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { TASK_STOPPED } from '../common/Constants';
import { TASK_STOP } from './../common/Constants';
import { MESSAGES } from './constants/Constants';
import { CookieJar } from './CookieJar';
import { TaskChannel } from './IpcChannels';
import { debug } from './Log';
import { ProfileManager } from './ProfileManager';
import { ProxySetManager } from './ProxySetManager';
import { RequestInstance } from './RequestInstance';

export const CANCEL_ERROR = 'Cancel';
const log = debug.extend('Task');
export interface ITask {
    taskData: TaskData;
    userProfile: Profile;
    proxy: Proxy;
    isRunning: boolean;
    status: Status;
    taskGroupName: string;
}

export abstract class Task extends EventEmitter implements ITask {
    protected requestInstance: RequestInstance;
    protected cookieJar!: CookieJar;
    protected cancel: boolean;
    protected cancelTimeout: () => void;
    protected uuid: string;
    protected axiosSession: AxiosInstance;
    protected profileManager: ProfileManager;
    protected proxyManager: ProxySetManager;
    public taskData: TaskData;
    public userProfile: Profile;
    public proxy: Proxy;
    public isRunning: boolean;
    public status: Status;
    public taskGroupName: string;

    constructor(
        uuid: string,
        requestInstance: RequestInstance,
        taskData: TaskData,
        taskGroupName: string,
        profileManager: ProfileManager,
        proxyManager: ProxySetManager,
    ) {
        super();
        this.requestInstance = requestInstance;
        this.axiosSession = requestInstance.axios;
        this.cancel = false;
        this.cancelTimeout = () => {};
        this.uuid = uuid;
        this.taskData = taskData;
        this.profileManager = profileManager;
        this.proxyManager = proxyManager;
        this.taskGroupName = taskGroupName;

        this.status = { level: 'idle', message: 'Idle' };

        this.loadUserProfile();
        if (this.taskData.proxySet) {
            this.loadProxy();
        }
    }

    abstract doTask(): void;

    // Return a simple interface to be send to the view
    public getValue(): ITask {
        return {
            proxy: this.proxy,
            taskData: this.taskData,
            userProfile: this.userProfile,
            isRunning: this.isRunning,
            status: this.status,
            taskGroupName: this.taskGroupName,
        };
    }

    protected loadUserProfile(): void {
        const profile = this.profileManager.getProfileMap().get(this.taskData.profileName);
        this.userProfile = profile;
    }

    protected loadProxy(): void {
        this.proxy = this.proxyManager.pickProxyFromSet(this.taskData.proxySet);
        this.requestInstance.updateProxy(this.proxy);
    }

    protected unLoadProxy(): void {
        this.proxy = null;
        this.taskData.proxySet = null;
        this.requestInstance.updateProxy(null);
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

    // TODO REMOVE THAT SHIT
    updateData(taskData: TaskData): void {
        console.log('updated old', this.taskData);
        // if (this.taskData.proxy?.host !== taskData.proxy?.host) this.updateProxy(taskData.proxy);
        this.taskData = taskData;
        console.log('updated new', this.taskData, taskData);
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
