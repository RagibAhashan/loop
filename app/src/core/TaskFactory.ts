import { STORES } from '../constants/Stores';
import UserAgentProvider from '../services/UserAgentProvider';
import { StoreInfo, StoreType } from './../constants/Stores';
import { Captcha, FLTaskData, Status, TaskData, WalmartTaskData } from './../interfaces/TaskInterfaces';
import { FootLockerTask } from './footlocker/FootLockerTask';
import { TaskChannel } from './IpcChannels';
import { debug } from './Log';
import { ProfileManager } from './ProfileManager';
import { ProxySetManager } from './ProxySetManager';
import { RequestInstance } from './RequestInstance';
import { Task } from './Task';
import { taskManager } from './TaskManager';
import { WalmartCATask } from './walmart/WalmartCATask';
import { WalmartUSTask } from './walmart/WalmartUSTask';

const log = debug.extend('TaskFactory');
export class TaskFactory {
    private profileManager: ProfileManager;
    private proxyManager: ProxySetManager;

    constructor(profileManager: ProfileManager, proxyManager: ProxySetManager) {
        this.profileManager = profileManager;
        this.proxyManager = proxyManager;
    }
    public createTask(event: Electron.IpcMainEvent, storeType: StoreType, taskData: TaskData): Task {
        let task: Task;
        switch (storeType) {
            case StoreType.WalmartCA:
            case StoreType.WalmartUS:
                task = this.createWalmartTask(storeType, taskData as WalmartTaskData);
                break;
            case StoreType.FootlockerCA:
            case StoreType.FootlockerUS:
                task = this.createFootlockerTask(storeType, taskData as FLTaskData);
                break;
        }

        task.on(TaskChannel.onTaskStatus, (message: Status) => {
            event.reply(TaskChannel.onTaskStatus + task.taskData.uuid, message);
        });

        // task.on(TaskChannel.onTaskStatus, () => {
        //     event.reply(uuid + TASK_STOPPED, uuid);
        // });

        task.on(TaskChannel.onCaptcha, (captcha: Captcha) => {
            log('task got captcha sending to renderer');
            event.reply(TaskChannel.onCaptcha + task.taskData.uuid, captcha);
        });

        task.on(TaskChannel.onTaskSuccess, () => {
            event.reply(task.taskData.uuid + 'TASK_SUCCESS');
        });

        return task;
    }
    public createFootlockerTask(storeType: StoreType, taskData: FLTaskData): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store, { timestamp: Date.now() });

        const flTask = new FootLockerTask(taskData.uuid, axios, taskData, this.profileManager, this.proxyManager);

        taskManager.register(taskData.uuid, flTask);

        return flTask;
    }

    private createWalmartTask(storeType: StoreType, taskData: WalmartTaskData): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store);

        let wTask;
        switch (storeType) {
            case StoreType.WalmartCA:
                wTask = new WalmartCATask(taskData.uuid, axios, taskData, this.profileManager, this.proxyManager);
                break;
            case StoreType.WalmartUS:
                wTask = new WalmartUSTask(taskData.uuid, axios, taskData, this.profileManager, this.proxyManager);
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
