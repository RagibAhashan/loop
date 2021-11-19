import { ITask } from '@core/Task';
import { TaskData } from '@interfaces/TaskInterfaces';
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
    private taskGroupFactory: TaskGroupFactory;

    constructor(taskGroupFactory: TaskGroupFactory) {
        this.taskGroupMap = new Map();
        this.taskGroupFactory = taskGroupFactory;
    }

    public ready(): void {
        this.registerListeners();
    }

    private addTaskGroup(name: string, storeType: StoreType): ITaskGroup[] | null {
        if (this.taskGroupMap.has(name)) {
            log('[Group %s already exists]', name);
            return null;
        }

        const newGroup = this.taskGroupFactory.createTaskGroup(name, storeType);

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
        const taskGroups: ITaskGroup[] = [];
        this.taskGroupMap.forEach((taskGroup) => taskGroups.push(taskGroup.getValue()));
        return taskGroups;
    }

    private addTaskToGroup(groupName: string, taskDatas: TaskData[]): ITask[] | null {
        if (!this.taskGroupMap.has(groupName)) {
            log('[Group %s not found]', groupName);
            return null;
        }
        const taskGroup = this.taskGroupMap.get(groupName);

        for (const taskData of taskDatas) {
            taskGroup.addTasks(taskData);
        }

        return taskGroup.getAllTasks();
    }

    private removeTaskFromGroup(groupName: string, uuids: string[]): ITask[] | null {
        if (!this.taskGroupMap.has(groupName)) {
            log('[Group %s not found]', groupName);
            return null;
        }
        const taskGroup = this.taskGroupMap.get(groupName);

        for (const uuid of uuids) {
            taskGroup.removeTask(uuid);
        }

        return taskGroup.getAllTasks();
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
                log('Replying task group update after add');
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
                event.reply(TaskGroupChannel.onTaskGroupSelected, currentTaskGroup.getValue(), tasks);
            }
        });

        ipcMain.on(TaskGroupChannel.addTaskToGroup, (event, name: string, tasks: TaskData[]) => {
            const taskList = this.addTaskToGroup(name, tasks);

            if (taskList) {
                event.reply(TaskGroupChannel.tasksUpdated, taskList);
            } else {
                event.reply(TaskGroupChannel.taskGroupError, 'Error');
            }
        });

        ipcMain.on(TaskGroupChannel.removeTaskFromGroup, (event, name: string, uuids: string[]) => {
            const taskList = this.removeTaskFromGroup(name, uuids);
            if (taskList) {
                event.reply(TaskGroupChannel.tasksUpdated, taskList);
            } else {
                event.reply(TaskGroupChannel.taskGroupError, 'Error');
            }
        });
    }
}
