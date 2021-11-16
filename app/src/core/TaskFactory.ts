import { STORES } from '../constants/Stores';
import UserAgentProvider from '../services/UserAgentProvider';
import { StoreInfo, StoreType } from './../constants/Stores';
import { FLTaskData, TaskData, WalmartTaskData } from './../interfaces/TaskInterfaces';
import { FootLockerTask } from './footlocker/FootLockerTask';
import { IProxy, Proxy } from './Proxy';
import { RequestInstance } from './RequestInstance';
import { Task } from './Task';
import { taskManager } from './TaskManager';
import { WalmartCATask } from './walmart/WalmartCATask';
import { WalmartUSTask } from './walmart/WalmartUSTask';
export class TaskFactory {
    public static createTask(storeType: StoreType, taskData: TaskData): Task {
        let task;
        switch (storeType) {
            case StoreType.WalmartCA:
            case StoreType.WalmartUS:
                task = TaskFactory.createWalmartTask(storeType, taskData as WalmartTaskData);
                break;
            case StoreType.FootlockerCA:
            case StoreType.FootlockerUS:
                task = TaskFactory.createFootlockerTask(storeType, taskData as FLTaskData);
                break;
        }

        return task;
    }
    public static createFootlockerTask(storeType: StoreType, taskData: FLTaskData): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store, taskData.proxy, { timestamp: Date.now() });

        const flTask = new FootLockerTask(taskData.uuid, axios, taskData);

        taskManager.register(taskData.uuid, flTask);

        return flTask;
    }

    private static createWalmartTask(storeType: StoreType, taskData: WalmartTaskData): Task {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store, taskData.proxy);

        let wTask;
        switch (storeType) {
            case StoreType.WalmartCA:
                wTask = new WalmartCATask(taskData.uuid, axios, taskData);
                break;
            case StoreType.WalmartUS:
                wTask = new WalmartUSTask(taskData.uuid, axios, taskData);
                break;
        }

        taskManager.register(taskData.uuid, wTask);

        return wTask;
    }

    private static createRequestInstance(store: StoreInfo, proxy: IProxy | null, params?: any): RequestInstance {
        const commonHeader = {
            'user-agent': UserAgentProvider.randomUserAgent(),
        };
        const axios = new RequestInstance(store.baseURL, params, commonHeader, proxy ? new Proxy(proxy.host, proxy.credentials) : undefined);

        return axios;
    }
}
