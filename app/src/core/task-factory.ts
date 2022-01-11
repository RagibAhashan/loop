import { BrowserWindow } from 'electron';
import { StoreInfo, STORES, StoreType } from '../constants/stores';
import { Captcha } from '../interfaces/TaskInterfaces';
import UserAgentProvider from '../services/user-agent-provider';
import { AccountGroupStore } from './account-group-store';
import { debug } from './log';
import { ProfileGroupStore } from './profile-group-store';
import { ProxyGroupStore } from './proxy-group-store';
import { RequestInstance } from './request-instance';
import { Task, TaskEmittedEvents, TaskFormData, TaskStatus } from './task';
import { WalmartCATask } from './walmart/walmart-ca-task';
import { WalmartUSTask } from './walmart/walmart-us-task';

const log = debug.extend('TaskFactory');
export class TaskFactory {
    // TODO : should not have electron logic here
    // mainWindow is used to send a message to the window on task evens (status, captcha, etc)
    private mainWindow: BrowserWindow;
    private proxyGroupStore: ProxyGroupStore;
    private profileGroupStore: ProfileGroupStore;
    private accountGroupStore: AccountGroupStore;

    constructor(
        mainWindow: BrowserWindow,
        proxyGroupStore: ProxyGroupStore,
        profileGroupStore: ProfileGroupStore,
        accountGroupStore: AccountGroupStore,
    ) {
        this.mainWindow = mainWindow;
        this.profileGroupStore = profileGroupStore;
        this.proxyGroupStore = proxyGroupStore;
        this.accountGroupStore = accountGroupStore;
    }
    public createTask(storeType: StoreType, taskData: TaskFormData, groupId: string): Task {
        let task: Task;
        switch (storeType) {
            case StoreType.WalmartCA:
            case StoreType.WalmartUS:
                task = this.createWalmartTask(storeType, taskData, groupId);
                break;
        }

        // TODO maybe just use webContents.send directly in Task

        task.on(TaskEmittedEvents.Status, (message: TaskStatus) => {
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

    private createWalmartTask(storeType: StoreType, taskData: TaskFormData, groupId: string): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store);

        const userProfile = this.profileGroupStore.getProfileGroup(taskData.profile.groupId).getProfile(taskData.profile.id);

        if (userProfile) userProfile.setTaskId({ groupId: groupId, id: taskData.id });

        const proxySet = taskData.proxyGroupId ? this.proxyGroupStore.getProxyGroup(taskData.proxyGroupId) : null;
        const account = taskData.account ? this.accountGroupStore.getAccountGroup(taskData.account.groupId).getAccount(taskData.account.id) : null;

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
                    groupId,
                    axios,
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
                    groupId,
                    axios,
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
