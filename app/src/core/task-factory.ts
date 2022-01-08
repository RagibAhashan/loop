import { BrowserWindow } from 'electron';
import { StoreInfo, STORES, StoreType } from '../constants/stores';
import { Captcha, Status } from '../interfaces/TaskInterfaces';
import UserAgentProvider from '../services/user-agent-provider';
import { TaskChannel } from './ipc-channels';
import { debug } from './log';
import { ProfileGroupManager } from './profilegroup-manager';
import { ProxySetManager } from './proxyset-manager';
import { RequestInstance } from './request-instance';
import { ITask, Task } from './task';
import { WalmartCATask } from './walmart/walmart-ca-task';
import { WalmartUSTask } from './walmart/walmart-us-task';

const log = debug.extend('TaskFactory');
export class TaskFactory {
    private profileGroupManager: ProfileGroupManager;
    private proxyManager: ProxySetManager;
    // TODO : should not have electron logic here
    // mainWindow is used to send a message to the window on task evens (status, captcha, etc)
    private mainWindow: BrowserWindow;

    constructor(profileGroupManager: ProfileGroupManager, proxyManager: ProxySetManager, mainWindow: BrowserWindow) {
        this.profileGroupManager = profileGroupManager;
        this.proxyManager = proxyManager;
        this.mainWindow = mainWindow;
    }
    public createTask(storeType: StoreType, taskData: Partial<ITask>, taskGroupId: string): Task {
        let task: Task;
        switch (storeType) {
            case StoreType.WalmartCA:
            case StoreType.WalmartUS:
                task = this.createWalmartTask(storeType, taskData, taskGroupId);
                break;
        }

        task.on(TaskChannel.onTaskStatus, (message: Status) => {
            this.mainWindow.webContents.send(TaskChannel.onTaskStatus + task.id, message);
        });

        // task.on(TaskChannel.onTaskStatus, () => {
        //     event.reply(uuid + TASK_STOPPED, uuid);
        // });

        task.on(TaskChannel.onCaptcha, (captcha: Captcha) => {
            log('task got captcha sending to renderer');
            this.mainWindow.webContents.send(TaskChannel.onCaptcha + task.id, captcha);
        });

        task.on(TaskChannel.onTaskSuccess, () => {
            this.mainWindow.webContents.send(task.id + 'TASK_SUCCESS');
        });

        return task;
    }

    private createWalmartTask(storeType: StoreType, taskData: Partial<ITask>, taskGroupId: string): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store);

        let wTask;
        switch (storeType) {
            case StoreType.WalmartCA:
                wTask = new WalmartCATask(
                    taskData.id,
                    taskData.retryDelay,
                    taskData.productIdentifier,
                    taskData.userProfile,
                    taskData.proxySet,
                    taskData.account,
                    taskData.productQuantity,
                    taskGroupId,
                    axios,
                    this.profileGroupManager,
                    this.proxyManager,
                );
                break;
            case StoreType.WalmartUS:
                wTask = new WalmartUSTask(
                    taskData.id,
                    taskData.retryDelay,
                    taskData.productIdentifier,
                    taskData.userProfile,
                    taskData.proxySet,
                    taskData.account,
                    taskData.productQuantity,
                    taskGroupId,
                    axios,
                    this.profileGroupManager,
                    this.proxyManager,
                );
                break;
        }

        return wTask;
    }

    private createRequestInstance(store: StoreInfo, params?: any): RequestInstance {
        const commonHeader = {
            'user-agent': UserAgentProvider.randomUserAgent(),
        };
        const requestInstance = new RequestInstance(store.baseURL, params, commonHeader);

        return requestInstance;
    }
}
