import { v4 as uuidv4 } from 'uuid';
import { StoreType } from '../constants/Stores';
import { TaskData } from './../interfaces/TaskInterfaces';
import { debug } from './Log';
import { Task } from './Task';
import { TaskFactory } from './TaskFactory';

const log = debug.extend('TaskGroup');

export interface ITaskGroup {
    name: string;
    tasks: Map<string, Task>;
    storeType: StoreType;
}

export type TaskMap = Map<string, Task>;

export class TaskGroup implements ITaskGroup {
    name: string;
    tasks: TaskMap;
    storeType: StoreType;

    constructor(name: string, storeType: StoreType) {
        this.name = name;
        this.storeType = storeType;
        this.tasks = new Map();
    }

    addTasks(tasks: TaskData[]): void {
        for (const taskData of tasks) {
            const uuid = uuidv4();
            const newTask = TaskFactory.createTask(this.storeType, taskData);

            //Should never happen
            if (this.tasks.has(uuid)) {
                log('UUID already exists in task map, could not add task %s %s', uuid, this.storeType);
                continue;
            }

            this.tasks.set(uuid, newTask);
        }
    }

    removeTask(uuids: string[]): void {
        for (const uuid of uuids) {
            if (this.tasks.has(uuid)) {
                this.tasks.delete(uuid);
            }
        }
    }

    getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    editName(newName: string): void {
        this.name = newName;
    }

    editStore(newStoreType: StoreType): void {
        this.storeType = newStoreType;
        this.tasks.clear();
    }
}
