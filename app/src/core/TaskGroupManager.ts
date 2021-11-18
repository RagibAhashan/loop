import { ipcMain } from 'electron';
import { StoreType } from './../constants/Stores';
import { TaskGroupChannel } from './IpcChannels';
import { debug } from './Log';
import { ITaskGroup, TaskGroup } from './TaskGroup';
import { TaskGroupFactory } from './TaskGroupFactory';

const log = debug.extend('TaskGroupManager');
export type TaskGroupMap = Map<string, TaskGroup>;
export class TaskGroupManager {
    private taskGroupMap: TaskGroupMap;

    constructor() {
        this.taskGroupMap = new Map();
    }

    public ready(): void {
        this.registerListeners();
    }

    private addTaskGroup(name: string, storeType: StoreType): ITaskGroup[] | null {
        if (this.taskGroupMap.has(name)) {
            log('[Group %s already exists]', name);
            return null;
        }

        const newGroup = TaskGroupFactory.createTaskGroup(name, storeType);

        this.taskGroupMap.set(name, newGroup);
        return this.getAllTaskGroups();
    }

    private removeTaskGroup(name: string): ITaskGroup[] | null {
        if (!this.taskGroupMap.has(name)) {
            log('[Group %s not found]', name);
            return null;
        }

        this.taskGroupMap.delete(name);
        return this.getAllTaskGroups();
    }

    private getTaskGroup(name: string): TaskGroup | undefined {
        return this.taskGroupMap.get(name);
    }

    private getAllTaskGroups(): ITaskGroup[] {
        return Array.from(this.taskGroupMap.values());
    }

    private editTaskGroupName(oldName: string, newName: string): void {
        const taskGroup = this.taskGroupMap.get(oldName);
        taskGroup.editName(newName);
    }

    private editTaskGroupStore(name: string, newStoreType: StoreType): void {
        const taskGroup = this.taskGroupMap.get(name);
        taskGroup.editStore(newStoreType);
    }

    private registerListeners(): void {
        ipcMain.handle(TaskGroupChannel.getAllTaskGroups, (_) => {
            return this.getAllTaskGroups();
        });

        ipcMain.on(TaskGroupChannel.addTaskGroup, (event, name: string, storeType: StoreType) => {
            const taskGroups = this.addTaskGroup(name, storeType);
            if (taskGroups) {
                event.reply(TaskGroupChannel.taskGroupUpdated, taskGroups);
            } else {
                event.reply(TaskGroupChannel.taskGroupError);
            }
        });

        ipcMain.on(TaskGroupChannel.removeTaskGroup, (event, name: string) => {
            const taskGroups = this.removeTaskGroup(name);
            if (taskGroups) {
                event.reply(TaskGroupChannel.taskGroupUpdated, taskGroups);
            } else {
                event.reply(TaskGroupChannel.taskGroupError);
            }
        });

        ipcMain.on(TaskGroupChannel.getTaskGroupTasks, (event, name: string) => {
            const currentTaskGroup = this.getTaskGroup(name);
            if (currentTaskGroup) {
                const tasks = currentTaskGroup.getAllTasks();
                event.reply(TaskGroupChannel.onTaskGroupSelected, currentTaskGroup.storeType, tasks);
            }
        });
    }
}
