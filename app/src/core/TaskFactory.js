const taskManager = require('./TaskManager');
const { STORES } = require('../common/Constants');
const { Proxy } = require('./Proxy');
class TaskFactory {
    createFootlockerTask(storeName, uuid, productSKU, sizes, deviceId, userProfile, retryDelay, proxy = undefined) {
        const store = STORES[storeName];

        const { RequestInstance } = require('./RequestInstance');
        const { FootLockerTask } = require('./footlocker/FootLockerTask');
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

module.exports = new TaskFactory();
