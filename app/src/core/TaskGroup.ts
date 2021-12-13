import { TASK_STOP } from '@common/Constants';
import { StoreType } from '../constants/Stores';
import { debug } from './Log';
import { ITask, Task } from './Task';

const log = debug.extend('TaskGroup');

export interface ITaskGroup {
    name: string;
    storeType: StoreType;
}

export type TaskMap = Map<string, Task>;

export class TaskGroup implements ITaskGroup {
    name: string;
    storeType: StoreType;
    tasks: TaskMap;

    constructor(name: string, storeType: StoreType) {
        this.name = name;
        this.storeType = storeType;
        this.tasks = new Map();
    }

    // Returns a simple data format for the view
    public getValue(): ITaskGroup {
        return { name: this.name, storeType: this.storeType };
    }

    public addTasks(task: Task): void {
        //Should never happen
        if (this.tasks.has(task.taskData.uuid)) {
            log('UUID already exists in task map, could not add task %s %s', task.taskData.uuid, this.storeType);
            return;
        }

        this.tasks.set(task.taskData.uuid, task);
    }

    public removeTask(uuid: string): void {
        if (this.tasks.has(uuid)) {
            this.tasks.delete(uuid);
        }
    }

    public removeAllTasks(): void {
        // stop all tasks
        this.stopAllTasks();
        this.tasks = new Map();
    }

    public getAllTasks(): ITask[] {
        const tasks: ITask[] = [];
        this.tasks.forEach((task) => tasks.push(task.getValue()));
        return tasks;
    }

    public getTask(uuid: string): ITask {
        const task = this.tasks.get(uuid);
        return task.getValue();
    }

    public startTask(uuid: string): void {
        const task = this.tasks.get(uuid);
        task.execute();
    }

    public startAllTasks(): void {
        for (const task of this.tasks.values()) {
            task.execute();
        }
    }

    public stopTask(uuid: string): void {
        log('Stopping task');
        const task = this.tasks.get(uuid);
        task.emit(TASK_STOP);
    }

    public stopAllTasks(): void {
        for (const task of this.tasks.values()) {
            task.emit(TASK_STOP);
        }
    }

    public editName(newName: string): void {
        this.name = newName;
    }

    public editStore(newStoreType: StoreType): void {
        this.storeType = newStoreType;
        this.tasks.clear();
    }
}
