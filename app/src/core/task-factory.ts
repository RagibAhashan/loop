import { BrowserWindow } from 'electron';
import { StoreInfo, STORES, StoreType } from '../constants/Stores';
import { Captcha, Status } from '../interfaces/TaskInterfaces';
import UserAgentProvider from '../services/user-agent-provider';
import { FootLockerTask, IFootLockerTask } from './footlocker/FootLockerTask';
import { TaskChannel } from './ipc-channels';
import { debug } from './log';
import { ProfileGroupManager } from './profilegroup-manager';
import { ProxySetManager } from './proxyset-manager';
import { RequestInstance } from './request-instance';
import { ITask, Task } from './task';
import { taskManager } from './task-manager';
import { WalmartCATask } from './walmart/walmart-ca-task';
import { IWalmartTask } from './walmart/walmart-task';
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
                task = this.createWalmartTask(storeType, taskData as Partial<IWalmartTask>, taskGroupId);
                break;
            case StoreType.FootlockerCA:
            case StoreType.FootlockerUS:
                task = this.createFootlockerTask(storeType, taskData as Partial<IFootLockerTask>, taskGroupId);
                break;
        }

        task.on(TaskChannel.onTaskStatus, (message: Status) => {
            this.mainWindow.webContents.send(TaskChannel.onTaskStatus + task.uuid, message);
        });

        // task.on(TaskChannel.onTaskStatus, () => {
        //     event.reply(uuid + TASK_STOPPED, uuid);
        // });

        task.on(TaskChannel.onCaptcha, (captcha: Captcha) => {
            log('task got captcha sending to renderer');
            this.mainWindow.webContents.send(TaskChannel.onCaptcha + task.uuid, captcha);
        });

        task.on(TaskChannel.onTaskSuccess, () => {
            this.mainWindow.webContents.send(task.uuid + 'TASK_SUCCESS');
        });

        return task;
    }
    public createFootlockerTask(storeType: StoreType, taskData: Partial<IFootLockerTask>, taskGroupId: string): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store, { timestamp: Date.now() });

        const flTask = new FootLockerTask(
            taskData.uuid,
            taskData.retryDelay,
            taskData.userProfile,
            taskData.proxySet,
            taskData.proxy,
            taskGroupId,
            axios,
            this.profileGroupManager,
            this.proxyManager,
            taskData.productSKU,
            taskData.sizes,
            taskData.deviceId,
        );

        taskManager.register(taskData.uuid, flTask);

        return flTask;
    }

    private createWalmartTask(storeType: StoreType, taskData: Partial<IWalmartTask>, taskGroupId: string): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store);

        let wTask;
        switch (storeType) {
            case StoreType.WalmartCA:
                wTask = new WalmartCATask(
                    taskData.uuid,
                    taskData.retryDelay,
                    taskData.userProfile,
                    taskData.proxySet,
                    taskData.proxy,
                    taskGroupId,
                    axios,
                    this.profileGroupManager,
                    this.proxyManager,
                    taskData.offerId,
                    taskData.productQuantity,
                    taskData.productSKU,
                );
                break;
            case StoreType.WalmartUS:
                wTask = new WalmartUSTask(
                    taskData.uuid,
                    taskData.retryDelay,
                    taskData.userProfile,
                    taskData.proxySet,
                    taskData.proxy,
                    taskGroupId,
                    axios,
                    this.profileGroupManager,
                    this.proxyManager,
                    taskData.offerId,
                    taskData.productQuantity,
                    taskData.productSKU,
                );
                break;
        }

        taskManager.register(taskData.uuid, wTask);

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
