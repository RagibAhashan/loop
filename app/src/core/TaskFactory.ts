import { STORES } from '../constants/Stores';
import { StoreType } from './../constants/Stores';
import { UserProfile } from './../interfaces/TaskInterfaces';
import { FootLockerTask } from './footlocker/FootLockerTask';
import { Proxy } from './Proxy';
import { RequestInstance } from './RequestInstance';
import { taskManager } from './TaskManager';
export class TaskFactory {
    public static createFootlockerTask(
        storeName: StoreType,
        uuid: string,
        productSKU: string,
        sizes: string[],
        deviceId: string,
        userProfile: UserProfile,
        retryDelay: number,
        proxy?: any,
    ) {
        const store = STORES[storeName];

        const axios = new RequestInstance(
            store.baseURL,
            { timestamp: Date.now() },
            store.headers,
            proxy ? new Proxy(proxy.proxy, proxy.credential) : undefined,
        );
        const flTask = new FootLockerTask(uuid, axios, productSKU, sizes, deviceId, userProfile, retryDelay);

        taskManager.register(uuid, flTask);

        return flTask;
    }
}
