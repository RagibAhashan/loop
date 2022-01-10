import { BrowserWindow } from 'electron';
import { StoreInfo, STORES, StoreType } from '../constants/stores';
import { Captcha, Status } from '../interfaces/TaskInterfaces';
import UserAgentProvider from '../services/user-agent-provider';
import { AccountGroupManager } from './account-group-manager';
import { debug } from './log';
import { ProfileGroupManager } from './profilegroup-manager';
import { ProxySetManager } from './proxyset-manager';
import { RequestInstance } from './request-instance';
import { Task, TaskEmittedEvents, TaskFormData } from './task';
import { WalmartCATask } from './walmart/walmart-ca-task';
import { WalmartUSTask } from './walmart/walmart-us-task';

const log = debug.extend('TaskFactory');
export class TaskFactory {
    private profileGroupManager: ProfileGroupManager;
    private proxyManager: ProxySetManager;
    private accountManager: AccountGroupManager;
    // TODO : should not have electron logic here
    // mainWindow is used to send a message to the window on task evens (status, captcha, etc)
    private mainWindow: BrowserWindow;

    constructor(
        profileGroupManager: ProfileGroupManager,
        proxyManager: ProxySetManager,
        accountManager: AccountGroupManager,
        mainWindow: BrowserWindow,
    ) {
        this.profileGroupManager = profileGroupManager;
        this.proxyManager = proxyManager;
        this.mainWindow = mainWindow;
        this.accountManager = accountManager;
    }
    public createTask(storeType: StoreType, taskData: TaskFormData, taskGroupId: string): Task {
        let task: Task;
        switch (storeType) {
            case StoreType.WalmartCA:
            case StoreType.WalmartUS:
                task = this.createWalmartTask(storeType, taskData, taskGroupId);
                break;
        }

        task.on(TaskEmittedEvents.Status, (message: Status) => {
            this.mainWindow.webContents.send(TaskEmittedEvents.Status + task.id, message);
        });

        task.on(TaskEmittedEvents.Captcha, (captcha: Captcha) => {
            log('task got captcha sending to renderer');
            this.mainWindow.webContents.send(TaskEmittedEvents.Captcha + task.id, captcha);
        });

        task.on(TaskEmittedEvents.Succeeded, () => {
            this.mainWindow.webContents.send(TaskEmittedEvents.Succeeded + task.id);
        });

        return task;
    }

    private createWalmartTask(storeType: StoreType, taskData: TaskFormData, taskGroupId: string): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store);
        const userProfile = this.profileGroupManager.getProfileGroup(taskData.profile.groupId).getProfile(taskData.profile.id);

        if (userProfile) userProfile.setTaskId({ groupId: taskGroupId, id: taskData.id });

        const proxySet = taskData.proxySetId ? this.proxyManager.getProxySet(taskData.proxySetId) : null;
        const account = taskData.account ? this.accountManager.getAccountGroup(taskData.account.groupId).getAccount(taskData.account.id) : null;

        let wTask;
        switch (storeType) {
            case StoreType.WalmartCA:
                wTask = new WalmartCATask(
                    taskData.id,
                    taskData.retryDelay,
                    taskData.productIdentifier,
                    userProfile,
                    proxySet,
                    account,
                    taskData.productQuantity,
                    taskGroupId,
                    axios,
                    this.proxyManager,
                );
                break;
            case StoreType.WalmartUS:
                wTask = new WalmartUSTask(
                    taskData.id,
                    taskData.retryDelay,
                    taskData.productIdentifier,
                    userProfile,
                    proxySet,
                    account,
                    taskData.productQuantity,
                    taskGroupId,
                    axios,
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
