const taskManager = require('./TaskManager');

class TaskFactory {
    createFootlockerCA(uuid, productLink, productSKU, sizes, deviceId, userProfile, retryDelay) {
        const { FOOTLOCKER_CA_HEADERS } = require('./constants/Constants');
        const { RequestInstance } = require('./RequestInstance');
        const { FootLockerTask } = require('./footlocker/FootLockerTask');
        const axios = new RequestInstance('http://localhost:3200/api', { timestamp: Date.now() }, FOOTLOCKER_CA_HEADERS);
        const flTask = new FootLockerTask(productLink, productSKU, sizes, deviceId, axios, userProfile, retryDelay);

        taskManager.register(uuid, flTask);

        return flTask;
    }
}

module.exports = new TaskFactory();
