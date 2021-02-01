class TaskManager {
    constructor() {
        // Map<string, Object>
        this.tasks = new Map();
    }

    getTask(uuid) {
        return this.tasks.get(uuid);
    }

    register(uuid, task) {
        this.tasks.set(uuid, task);
    }
}

module.exports = new TaskManager();
