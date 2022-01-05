import { ITask, Task, TaskFormData, TaskViewData } from '@core/Task';
import { ipcMain } from 'electron';
import { StoreType } from './../constants/Stores';
import { AppDatabase } from './AppDatabase';
import { TaskGroupChannel } from './IpcChannels';
import { debug } from './Log';
import { TaskFactory } from './TaskFactory';
import { TaskGroup, TaskGroupViewData } from './TaskGroup';
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
        this.loadFromDB();
    }

    public async loadFromDB(): Promise<void> {
        const taskGroups = await this.database.loadModelDB<TaskGroup>('TaskGroup');
        const tasks = await this.database.loadModelDB<Task>('Task');

        if (!taskGroups || !tasks) return;

        for (const taskGroup of taskGroups) {
            this.addTaskGroup(taskGroup.id, taskGroup.name, taskGroup.storeType);

            // TODO Review this logic
            const taskDatas: ITask[] = [];

            tasks.forEach((task) => {
                if (task.taskGroupId === taskGroup.id) taskDatas.push(task);
            });

            this.addTaskToGroup(taskGroup.name, taskDatas);
        }

        log('TaskGroup Loaded');
    }

    public async saveToDB(): Promise<boolean> {
        const tgSaved = await this.database.saveModelDB<TaskGroup>('TaskGroup', this.getAllTaskGroups());
        const tSaved = await this.database.saveModelDB<Task>('Task', this.getAllTasks());

        if (!tgSaved || tSaved) return false;

        log('TaskGroups Saved to DB!');
        return true;
    }

    private addTaskGroup(id: string, name: string, storeType: StoreType): TaskGroupViewData[] | null {
        if (this.taskGroupMap.has(name)) {
            log('[Group %s already exists]', name);
            return null;
        }

        const newGroup = this.taskGroupFactory.createTaskGroup(id, name, storeType);

        this.taskGroupMap.set(id, newGroup);

        return this.getAllTaskGroupsViewData();
    }

    private removeTaskGroup(groupId: string): TaskGroupViewData[] | null {
        if (!this.taskGroupMap.has(groupId)) {
            log('[Group not found]');
            return null;
        }
        this.taskGroupMap.delete(groupId);

        return this.getAllTaskGroupsViewData();
    }

    private getTaskGroup(groupId: string): TaskGroup | undefined {
        return this.taskGroupMap.get(groupId);
    }

    private getAllTaskGroupsViewData(): TaskGroupViewData[] {
        const taskGroups: TaskGroupViewData[] = [];
        this.taskGroupMap.forEach((taskGroup) => taskGroups.push(taskGroup.getViewData()));
        return taskGroups;
    }

    private getAllTaskGroups(): TaskGroup[] {
        return Array.from(this.taskGroupMap.values());
    }

    private getAllTasks(): Task[] {
        const tasks: Task[] = [];
        this.taskGroupMap.forEach((taskGroup) => tasks.push(...taskGroup.getAllTasks()));
        return tasks;
    }

    private addTaskToGroup(groupId: string, taskDatas: Partial<ITask>[]): TaskViewData[] | null {
        if (!this.taskGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupId);

        const tempTaskDB = [];

        for (const taskData of taskDatas) {
            const newTask = this.taskFactory.createTask(taskGroup.storeType, taskData, groupId);
            taskGroup.addTasks(newTask);
            tempTaskDB.push(tempTaskDB);
        }

        return taskGroup.getAllTasksViewData();
    }

    private removeTaskFromGroup(groupId: string, uuids: string[]): TaskViewData[] | null {
        if (!this.taskGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }
        const taskGroup = this.taskGroupMap.get(groupId);

        for (const uuid of uuids) {
            taskGroup.removeTask(uuid);
        }

        return taskGroup.getAllTasksViewData();
    }

    private removeAllTasksFromGroup(groupId: string): TaskViewData[] | null {
        if (!this.taskGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupId);

        taskGroup.removeAllTasks();

        return taskGroup.getAllTasksViewData();
    }

    private startTask(groupId: string, uuid: string): TaskViewData[] {
        if (!this.taskGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupId);

        taskGroup.startTask(uuid);

        return taskGroup.getAllTasksViewData();
    }

    private startAllTasks(groupId: string): TaskViewData[] {
        if (!this.taskGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupId);

        taskGroup.startAllTasks();

        return taskGroup.getAllTasksViewData();
    }

    private stopTask(groupId: string, uuid: string): TaskViewData[] {
        if (!this.taskGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupId);

        taskGroup.stopTask(uuid);

        return taskGroup.getAllTasksViewData();
    }

    private stopAllTasks(groupId: string): TaskViewData[] {
        if (!this.taskGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const taskGroup = this.taskGroupMap.get(groupId);

        taskGroup.stopAllTasks();

        return taskGroup.getAllTasksViewData();
    }

    private editTaskGroupName(groupId: string, newName: string): TaskGroupViewData[] {
        const taskGroup = this.taskGroupMap.get(groupId);

        taskGroup.editName(newName);

        return this.getAllTaskGroupsViewData();
    }

    private editTaskGroupStore(groupId: string, newStoreType: StoreType): TaskGroupViewData[] {
        const taskGroup = this.taskGroupMap.get(groupId);

        taskGroup.editStore(newStoreType);

        return this.getAllTaskGroupsViewData();
    }

    private registerListeners(): void {
        ipcMain.handle(TaskGroupChannel.getAllTaskGroups, (_): TaskGroupViewData[] => {
            return this.getAllTaskGroupsViewData();
        });

        ipcMain.on(TaskGroupChannel.addTaskGroup, (event, id: string, name: string, storeType: StoreType) => {
            const taskGroups = this.addTaskGroup(id, name, storeType);
            if (taskGroups) {
                event.reply(TaskGroupChannel.taskGroupUpdated, taskGroups);
            } else {
                event.reply(TaskGroupChannel.taskGroupError);
            }
        });

        ipcMain.on(TaskGroupChannel.removeTaskGroup, (event, groupId: string) => {
            const taskGroups = this.removeTaskGroup(groupId);
            if (taskGroups) {
                event.reply(TaskGroupChannel.taskGroupUpdated, taskGroups);
            } else {
                event.reply(TaskGroupChannel.taskGroupError);
            }
        });

        ipcMain.on(TaskGroupChannel.editTaskGroupName, (event, groupId: string, newName: string) => {
            const taskGroup = this.editTaskGroupName(groupId, newName);

            if (taskGroup) {
                event.reply(TaskGroupChannel.taskGroupUpdated, taskGroup);
            } else {
                event.reply(TaskGroupChannel.taskGroupError);
            }
        });

        ipcMain.on(TaskGroupChannel.editTaskGroupStore, (event, groupId: string, newStoreType: StoreType) => {
            const taskGroup = this.editTaskGroupStore(groupId, newStoreType);
            if (taskGroup) {
                event.reply(TaskGroupChannel.taskGroupUpdated, taskGroup);
            } else {
                event.reply(TaskGroupChannel.taskGroupError);
            }
        });

        ipcMain.on(TaskGroupChannel.getAllTasksFromTaskGroup, (event, groupId: string) => {
            const currentTaskGroup = this.getTaskGroup(groupId);
            if (currentTaskGroup) {
                const tasks = currentTaskGroup.getAllTasksViewData();
                event.reply(TaskGroupChannel.onTaskGroupSelected, currentTaskGroup.getViewData(), tasks);
            }
        });

        ipcMain.handle(TaskGroupChannel.getTaskFromTaskGroup, (event, groupId: string, uuid: string): TaskViewData => {
            const currentTaskGroup = this.getTaskGroup(groupId);
            if (currentTaskGroup) {
                const task = currentTaskGroup.getTaskViewData(uuid);
                return task;
            }
        });

        ipcMain.on(TaskGroupChannel.addTaskToGroup, (event, groupId: string, tasks: TaskFormData[]) => {
            const taskList = this.addTaskToGroup(groupId, tasks);

            if (taskList) {
                event.reply(TaskGroupChannel.tasksUpdated, taskList);
            } else {
                event.reply(TaskGroupChannel.taskGroupError, 'Error');
            }
        });

        ipcMain.on(TaskGroupChannel.removeTaskFromGroup, (event, groupId: string, uuids: string[]) => {
            const taskList = this.removeTaskFromGroup(groupId, uuids);
            if (taskList) {
                event.reply(TaskGroupChannel.tasksUpdated, taskList);
            } else {
                event.reply(TaskGroupChannel.taskGroupError, 'Error');
            }
        });

        ipcMain.on(TaskGroupChannel.removeAllTasksFromGroup, (event, groupId: string) => {
            const taskList = this.removeAllTasksFromGroup(groupId);
            if (taskList) {
                event.reply(TaskGroupChannel.tasksUpdated, taskList);
            } else {
                event.reply(TaskGroupChannel.taskGroupError, 'Error');
            }
        });

        ipcMain.on(TaskGroupChannel.startTask, (event, groupId: string, uuid: string) => {
            const taskList = this.startTask(groupId, uuid);
            event.reply(TaskGroupChannel.tasksUpdated, taskList);
        });

        ipcMain.on(TaskGroupChannel.startAllTasks, (event, groupId: string) => {
            const taskList = this.startAllTasks(groupId);
            event.reply(TaskGroupChannel.tasksUpdated, taskList);
        });

        ipcMain.on(TaskGroupChannel.stopTask, (event, groupId: string, uuid: string) => {
            const taskList = this.stopTask(groupId, uuid);
            event.reply(TaskGroupChannel.tasksUpdated, taskList);
        });

        ipcMain.on(TaskGroupChannel.stopAllTasks, (event, groupId: string) => {
            const taskList = this.stopAllTasks(groupId);
            event.reply(TaskGroupChannel.tasksUpdated, taskList);
        });
    }
}
