import { Task } from './Task';
class TaskManager {
    public tasks: Map<string, Task>;
    constructor() {
        this.tasks = new Map();
    }

    getTask(uuid: string): Task | undefined {
        return this.tasks.get(uuid);
    }

    register(uuid: string, task: Task): void {
        this.tasks.set(uuid, task);
    }

    remove(uuid: string): void {
        this.tasks.delete(uuid);
    }
}

export const taskManager = new TaskManager();
