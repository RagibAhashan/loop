import { TASK_STOP } from '@common/Constants';
import { StoreType } from '../constants/stores';
import { debug } from './log';
import { Task, TaskViewData } from './task';
import { Viewable } from './viewable';

const log = debug.extend('TaskGroup');

export const taskGroupPrefix = 'taskgrp';

export interface TaskGroupViewData {
    id: string;
    name: string;
    storeType: StoreType;
}

export interface ITaskGroup {
    id: string;
    name: string;
    storeType: StoreType;
    // add methods if necessary
}

export type TaskMap = Map<string, Task>;

export class TaskGroup implements ITaskGroup, Viewable<TaskGroupViewData> {
    id: string;
    name: string;
    storeType: StoreType;
    tasks: TaskMap;

    constructor(id: string, name: string, storeType: StoreType) {
        this.id = id;
        this.name = name;
        this.storeType = storeType;
        this.tasks = new Map();
    }

    public getViewData(): TaskGroupViewData {
        return {
            id: this.id,
            name: this.name,
            storeType: this.storeType,
        };
    }

    public addTasks(task: Task): void {
        //Should never happen
        if (this.tasks.has(task.id)) {
            log('Task already exists in task map, could not add task %s %s', task.id, this.storeType);
            return;
        }

        this.tasks.set(task.id, task);
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

    public getAllTasksViewData(): TaskViewData[] {
        const tasks: TaskViewData[] = [];
        this.tasks.forEach((task) => tasks.push(task.getViewData()));
        return tasks;
    }

    public getTaskViewData(uuid: string): TaskViewData {
        const task = this.tasks.get(uuid);
        return task.getViewData();
    }

    public getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    public getTask(uuid: string): Task {
        const task = this.tasks.get(uuid);
        return task;
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
