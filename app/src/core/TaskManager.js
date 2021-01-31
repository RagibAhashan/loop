class TaskManager {
    constructor() {
        // Map<string, Object>
        this.tasks = new Map();
    }

    getTask(uuid) {
        this.tasks.get(uuid);
    }

    register(uuid, task) {
        this.tasks.set(uuid, task);
    }
}

module.exports = new TaskManager();
