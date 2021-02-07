const taskManager = require('./TaskManager');
const { STORES } = require('../common/Constants');
class TaskFactory {
    createFootlockerTask(storeName, uuid, productLink, productSKU, sizes, deviceId, userProfile, retryDelay, proxies = undefined) {
        console.log(storeName);
        const store = STORES[storeName];
        const { RequestInstance } = require('./RequestInstance');
        const { FootLockerTask } = require('./footlocker/FootLockerTask');
        const axios = new RequestInstance(store.url, { timestamp: Date.now() }, store.header, proxies);
        const flTask = new FootLockerTask(productLink, productSKU, sizes, deviceId, axios, userProfile, retryDelay);

        taskManager.register(uuid, flTask);

        return flTask;
    }
}

module.exports = new TaskFactory();
