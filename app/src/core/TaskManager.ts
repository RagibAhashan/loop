import { StoreType } from '../constants/Stores';
import { Task } from './Task';

export type TaskMap = Map<string, Task>;
class TaskManager {
    public taskGroupMap: Map<string, TaskMap>;
    constructor() {
        this.taskGroupMap = new Map();
    }

    getTask(storeType: StoreType, uuid: string): Task | undefined {
        return this.taskMap.get(storeType).get(uuid);
    }

    register(uuid: string, task: Task): void {
        this.taskMap.set(uuid, task);
    }

    registerStore(storeType: StoreType): void {
        this.taskMap.set(storeType, new Map());
    }

    removeStore(uuid: string): void {
        this.taskMap.delete(uuid);
    }

    removeTask(): void {}
}

export const taskManager = new TaskManager();
