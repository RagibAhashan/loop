import { STORES } from '../common/Constants';
import { UserProfile } from './../interfaces/TaskInterfaces';
import { FootLockerTask } from './footlocker/FootLockerTask';
import { Proxy } from './Proxy';
import { RequestInstance } from './RequestInstance';
import { taskManager } from './TaskManager';
export class TaskFactory {
    public static createFootlockerTask(
        storeName: string,
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
            store.header,
            proxy ? new Proxy(proxy.proxy, proxy.credential) : undefined,
        );
        const flTask = new FootLockerTask(uuid, productSKU, sizes, deviceId, axios, userProfile, retryDelay);

        taskManager.register(uuid, flTask);

        return flTask;
    }
}
