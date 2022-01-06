import { Task } from './task';

export type TaskMap = Map<string, Task>;
class TaskManager {
    public taskMap: Map<string, Task>;
    constructor() {
        this.taskMap = new Map();
    }

    getTask(uuid: string): Task | undefined {
        return this.taskMap.get(uuid);
    }

    register(uuid: string, task: Task): void {
        this.taskMap.set(uuid, task);
    }

    removeStore(uuid: string): void {
        this.taskMap.delete(uuid);
    }

    removeTask(): void {}
}

export const taskManager = new TaskManager();
