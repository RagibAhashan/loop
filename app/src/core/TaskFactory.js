const taskManager = require('./TaskManager');
const { STORES } = require('../common/Constants');
class TaskFactory {
    createFootlockerTask(storeName, uuid, productSKU, sizes, deviceId, userProfile, retryDelay, proxies = undefined) {
        console.log(storeName);
        const store = STORES[storeName];

        // console.log(storeName, store);
        const { RequestInstance } = require('./RequestInstance');
        const { FootLockerTask } = require('./footlocker/FootLockerTask');
        const axios = new RequestInstance(store.url, { timestamp: Date.now() }, store.header, proxies);
        const flTask = new FootLockerTask(uuid, productSKU, sizes, deviceId, axios, userProfile, retryDelay);

        taskManager.register(uuid, flTask);

        return flTask;
    }
}

module.exports = new TaskFactory();
