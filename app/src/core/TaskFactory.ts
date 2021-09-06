import { STORES } from '../constants/Stores';
import { Proxy } from '../interfaces/OtherInterfaces';
import { StoreInfo, StoreType } from './../constants/Stores';
import { FLTaskData, WalmartTaskData } from './../interfaces/TaskInterfaces';
import { FootLockerTask } from './footlocker/FootLockerTask';
import { ProxyAgent } from './Proxy';
import { RequestInstance } from './RequestInstance';
import { Task } from './Task';
import { taskManager } from './TaskManager';
import { WalmartCATask } from './walmart/WalmartCATask';
import { WalmartUSTask } from './walmart/WalmartUSTask';
export class TaskFactory {
    public static createFootlockerTask(storeType: StoreType, taskData: FLTaskData) {
        const store = STORES[storeType];

        const axios = this.createRequestInstance(store, taskData.proxy, { timestamp: Date.now() });

        const flTask = new FootLockerTask(taskData.uuid, axios, taskData);

        taskManager.register(taskData.uuid, flTask);

        return flTask;
    }

    public static createWalmartTask(storeName: StoreType, taskData: WalmartTaskData): Task | undefined {
        const store = STORES[storeName];

        const axios = this.createRequestInstance(store, taskData.proxy);

        let wTask;
        switch (storeName) {
            case StoreType.WalmartCA:
                wTask = new WalmartCATask(taskData.uuid, axios, taskData);
                break;
            case StoreType.WalmartUS:
                wTask = new WalmartUSTask(taskData.uuid, axios, taskData);
                break;
            default:
                return;
        }

        taskManager.register(taskData.uuid, wTask);

        return wTask;
    }

    private static createRequestInstance(store: StoreInfo, proxy: Proxy | null, params?: any): RequestInstance {
        const axios = new RequestInstance(store.baseURL, params, store.headers, proxy ? new ProxyAgent(proxy.host, proxy.credential) : undefined);

        return axios;
    }
}
