import { ITask } from '@core/Task';
import { TaskData } from '@interfaces/TaskInterfaces';
import { ipcMain } from 'electron';
import { StoreType } from './../constants/Stores';
import { AppDatabase } from './AppDatabase';
import { TaskGroupChannel } from './IpcChannels';
import { debug } from './Log';
import { TaskFactory } from './TaskFactory';
import { ITaskGroup, TaskGroup } from './TaskGroup';
import { TaskGroupFactory } from './TaskGroupFactory';

const log = debug.extend('TaskGroupManager');
export type TaskGroupMap = Map<string, TaskGroup>;
export class TaskGroupManager {
    private taskGroupMap: TaskGroupMap;
    private taskGroupFactory: TaskGroupFactory;
    private database: AppDatabase;
    private taskFactory: TaskFactory;

    constructor(taskGroupFactory: TaskGroupFactory, taskFactory: TaskFactory, database: AppDatabase) {
        this.taskGroupMap = new Map();
        this.database = database;
        this.taskGroupFactory = taskGroupFactory;
        this.taskFactory = taskFactory;
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

        const group = this.taskGroupMap.get(name);

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

    private addTaskToGroup(event: Electron.IpcMainEvent, groupName: string, taskDatas: TaskData[]): ITask[] | null {
        if (!this.taskGroupMap.has(groupName)) {
            log('[Group %s not found]', groupName);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupName);

        const tempTaskDB = [];

        for (const taskData of taskDatas) {
            const newTask = this.taskFactory.createTask(event, taskGroup.storeType, taskData, groupName);
            taskGroup.addTasks(newTask);
            tempTaskDB.push(tempTaskDB);
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

    private removeAllTasksFromGroup(groupName: string): ITask[] | null {
        if (!this.taskGroupMap.has(groupName)) {
            log('[Group %s not found]', groupName);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupName);

        taskGroup.removeAllTasks();

        return taskGroup.getAllTasks();
    }

    private startTask(groupName: string, uuid: string): ITask[] {
        if (!this.taskGroupMap.has(groupName)) {
            log('[Group %s not found]', groupName);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupName);

        taskGroup.startTask(uuid);

        return taskGroup.getAllTasks();
    }

    private startAllTasks(groupName: string): ITask[] {
        if (!this.taskGroupMap.has(groupName)) {
            log('[Group %s not found]', groupName);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupName);

        taskGroup.startAllTasks();

        return taskGroup.getAllTasks();
    }

    private stopTask(groupName: string, uuid: string): ITask[] {
        if (!this.taskGroupMap.has(groupName)) {
            log('[Group %s not found]', groupName);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupName);

        taskGroup.stopTask(uuid);

        return taskGroup.getAllTasks();
    }

    private stopAllTasks(groupName: string): ITask[] {
        if (!this.taskGroupMap.has(groupName)) {
            log('[Group %s not found]', groupName);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupName);

        taskGroup.stopAllTasks();

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

        ipcMain.on(TaskGroupChannel.getAllTasksFromTaskGroup, (event, name: string) => {
            const currentTaskGroup = this.getTaskGroup(name);
            if (currentTaskGroup) {
                const tasks = currentTaskGroup.getAllTasks();
                event.reply(TaskGroupChannel.onTaskGroupSelected, currentTaskGroup.getValue(), tasks);
            }
        });

        ipcMain.handle(TaskGroupChannel.getTaskFromTaskGroup, (event, name: string, uuid: string): ITask => {
            const currentTaskGroup = this.getTaskGroup(name);
            if (currentTaskGroup) {
                const task = currentTaskGroup.getTask(uuid);
                return task;
            }
        });

        ipcMain.on(TaskGroupChannel.addTaskToGroup, (event, name: string, tasks: TaskData[]) => {
            const taskList = this.addTaskToGroup(event, name, tasks);

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

        ipcMain.on(TaskGroupChannel.removeAllTasksFromGroup, (event, name: string) => {
            const taskList = this.removeAllTasksFromGroup(name);
            if (taskList) {
                event.reply(TaskGroupChannel.tasksUpdated, taskList);
            } else {
                event.reply(TaskGroupChannel.taskGroupError, 'Error');
            }
        });

        ipcMain.on(TaskGroupChannel.startTask, (event, name: string, uuid: string) => {
            const taskList = this.startTask(name, uuid);
            event.reply(TaskGroupChannel.tasksUpdated, taskList);
        });

        ipcMain.on(TaskGroupChannel.startAllTasks, (event, name: string) => {
            const taskList = this.startAllTasks(name);
            event.reply(TaskGroupChannel.tasksUpdated, taskList);
        });

        ipcMain.on(TaskGroupChannel.stopTask, (event, name: string, uuid: string) => {
            const taskList = this.stopTask(name, uuid);
            event.reply(TaskGroupChannel.tasksUpdated, taskList);
        });

        ipcMain.on(TaskGroupChannel.stopAllTasks, (event, name: string) => {
            const taskList = this.stopAllTasks(name);
            event.reply(TaskGroupChannel.tasksUpdated, taskList);
        });
    }
}
