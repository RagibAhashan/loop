import { StoreType } from '../constants/Stores';
import { TaskData } from './../interfaces/TaskInterfaces';
import { debug } from './Log';
import { ITask, Task } from './Task';
import { TaskFactory } from './TaskFactory';

const log = debug.extend('TaskGroup');

export interface ITaskGroup {
    name: string;
    storeType: StoreType;
}

export type TaskMap = Map<string, Task>;

export class TaskGroup implements ITaskGroup {
    private taskFactory: TaskFactory;
    name: string;
    storeType: StoreType;
    tasks: TaskMap;

    constructor(name: string, storeType: StoreType, taskFactory: TaskFactory) {
        this.name = name;
        this.storeType = storeType;
        this.tasks = new Map();
        this.taskFactory = taskFactory;
    }

    // Returns a simple data format for the view
    public getValue(): ITaskGroup {
        return { name: this.name, storeType: this.storeType };
    }

    public addTasks(taskData: TaskData): void {
        const newTask = this.taskFactory.createTask(this.storeType, taskData);
        const uuid = newTask.taskData.uuid;
        //Should never happen
        if (this.tasks.has(uuid)) {
            log('UUID already exists in task map, could not add task %s %s', uuid, this.storeType);
            return;
        }

        this.tasks.set(uuid, newTask);
    }

    public removeTask(uuid: string): void {
        if (this.tasks.has(uuid)) {
            this.tasks.delete(uuid);
        }
    }

    public getAllTasks(): ITask[] {
        const tasks: ITask[] = [];
        this.tasks.forEach((task) => tasks.push(task.getValue()));
        return tasks;
    }

    public editName(newName: string): void {
        this.name = newName;
    }

    public editStore(newStoreType: StoreType): void {
        this.storeType = newStoreType;
        this.tasks.clear();
    }
}
