import { ITask, Task, TaskFormData, TaskViewData } from '@core/task';
import { ipcMain } from 'electron';
import { StoreType } from '../constants/stores';
import { AppDatabase } from './app-database';
import { TaskGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { TaskFactory } from './task-factory';
import { ITaskGroup, TaskGroup, TaskGroupViewData } from './taskgroup';
import { TaskGroupFactory } from './taskgroup-factory';

const log = debug.extend('TaskGroupManager');
export type TaskGroupMap = Map<string, TaskGroup>;

export class TaskGroupManager extends Manager {
    private taskGroupMap: TaskGroupMap;
    private taskGroupFactory: TaskGroupFactory;
    private taskFactory: TaskFactory;

    constructor(database: AppDatabase, taskGroupFactory: TaskGroupFactory, taskFactory: TaskFactory) {
        super(database);
        this.taskGroupMap = new Map();
        this.taskGroupFactory = taskGroupFactory;
        this.taskFactory = taskFactory;
    }

    protected async loadFromDB(): Promise<void> {
        const taskGroups = await this.database.loadModelDB<ITaskGroup[]>('TaskGroup');
        const tasks = await this.database.loadModelDB<ITask[]>('Task');

        if (!taskGroups || !tasks) return;

        for (const taskGroup of taskGroups) {
            this.addTaskGroup(taskGroup.id, taskGroup.name, taskGroup.storeType);

            // TODO Review this logic
            const taskDatas: TaskFormData[] = [];

            tasks.forEach((task) => {
                const taskFormData = this.taskInterfaceToTaskForm(task);
                if (task.taskGroupId === taskGroup.id) taskDatas.push(taskFormData);
            });

            this.addTaskToGroup(taskGroup.id, taskDatas);
        }

        log('TaskGroup Loaded');
    }

    /* Helper task to be used when getting an ITask from the DB and want to reuse the addTaskToGroup method
    which takes a TaskFormData
    */
    private taskInterfaceToTaskForm(task: ITask): TaskFormData {
        return {
            account: task.account ? { groupId: task.account.groupId, id: task.account.id } : null,
            proxySetId: task.proxySet ? task.proxySet.id : '',
            productIdentifier: task.productIdentifier,
            id: task.id,
            productQuantity: task.productQuantity,
            profile: { groupId: task.userProfile.groupId, id: task.userProfile.id },
            retryDelay: task.retryDelay,
        };
    }

    public async saveToDB(): Promise<boolean> {
        const tgSaved = await this.database.saveModelDB<ITaskGroup[]>('TaskGroup', this.getAllTaskGroups());
        const tSaved = await this.database.saveModelDB<ITask[]>('Task', this.getAllTasks());

        if (!tgSaved || tSaved) return false;

        log('TaskGroups Saved to DB!');
        return true;
    }

    private addTaskGroup(id: string, name: string, storeType: StoreType): TaskGroupViewData[] | null {
        if (this.findTaskGroupByName(name)) {
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

    public getTaskGroup(groupId: string): TaskGroup {
        const taskGroup = this.taskGroupMap.get(groupId);

        if (!taskGroup) throw new Error('getTaskGroup: Key not found ');

        return taskGroup;
    }

    private findTaskGroupByName(name: string): boolean {
        return Array.from(this.taskGroupMap.values()).some((taskGroup) => taskGroup.name === name);
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

    private addTaskToGroup(groupId: string, taskDatas: TaskFormData[]): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        for (const taskData of taskDatas) {
            const newTask = this.taskFactory.createTask(taskGroup.storeType, taskData, groupId);
            taskGroup.addTasks(newTask);
        }

        return taskGroup.getAllTasksViewData();
    }

    private removeTaskFromGroup(groupId: string, taskIds: string[]): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        for (const id of taskIds) {
            taskGroup.getTask(id).userProfile.setTaskId(null);
            taskGroup.getTask(id).account?.setTaskId(null);
            taskGroup.getTask(id).proxy?.setTaskId(null);

            taskGroup.removeTask(id);
        }

        return taskGroup.getAllTasksViewData();
    }

    private removeAllTasksFromGroup(groupId: string): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        taskGroup.getAllTasks().forEach((task) => {
            task.userProfile.setTaskId(null);
            task.account?.setTaskId(null);
            task.proxy?.setTaskId(null);
        });

        taskGroup.removeAllTasks();

        return taskGroup.getAllTasksViewData();
    }

    private startTask(groupId: string, uuid: string): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        taskGroup.startTask(uuid);

        return taskGroup.getAllTasksViewData();
    }

    private startAllTasks(groupId: string): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        taskGroup.startAllTasks();

        return taskGroup.getAllTasksViewData();
    }

    private stopTask(groupId: string, uuid: string): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        taskGroup.stopTask(uuid);

        return taskGroup.getAllTasksViewData();
    }

    private stopAllTasks(groupId: string): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        taskGroup.stopAllTasks();

        return taskGroup.getAllTasksViewData();
    }

    private editTaskGroupName(groupId: string, newName: string): TaskGroupViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        taskGroup.editName(newName);

        return this.getAllTaskGroupsViewData();
    }

    private editTaskGroupStore(groupId: string, newStoreType: StoreType): TaskGroupViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        taskGroup.editStore(newStoreType);

        return this.getAllTaskGroupsViewData();
    }

    protected registerListeners(): void {
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

        ipcMain.handle(TaskGroupChannel.getTaskFromTaskGroup, (event, groupId: string, id: string): TaskViewData => {
            const currentTaskGroup = this.getTaskGroup(groupId);
            const task = currentTaskGroup.getTaskViewData(id);
            return task;
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
