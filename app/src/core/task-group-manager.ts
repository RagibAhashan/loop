import { ITask, TaskFormData, TaskViewData } from '@core/task';
import { ipcMain } from 'electron';
import { StoreType } from '../constants/stores';
import { AccountGroupStore } from './account-group-store';
import { TaskGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { ProfileGroupStore } from './profile-group-store';
import { ProxyGroupStore } from './proxy-group-store';
import { TaskGroupViewData } from './task-group';
import { TaskGroupStore } from './task-group-store';

const log = debug.extend('TaskGroupManager');

export class TaskGroupManager extends Manager {
    private taskGroupStore: TaskGroupStore;
    private profileGroupStore: ProfileGroupStore;
    private accountGroupStore: AccountGroupStore;
    private proxyGroupStore: ProxyGroupStore;

    constructor(
        taskGroupStore: TaskGroupStore,
        profileGroupStore: ProfileGroupStore,
        accountGroupStore: AccountGroupStore,
        proxyGroupStore: ProxyGroupStore,
    ) {
        super();
        this.taskGroupStore = taskGroupStore;
        this.proxyGroupStore = proxyGroupStore;
        this.accountGroupStore = accountGroupStore;
        this.profileGroupStore = profileGroupStore;
    }

    protected async loadFromDB(): Promise<void> {
        await this.taskGroupStore.loadFromDB();
    }

    private startTask(groupId: string, uuid: string): TaskViewData[] {
        const taskGroup = this.taskGroupStore.getTaskGroup(groupId);

        taskGroup.startTask(uuid);

        return taskGroup.getAllTasksViewData();
    }

    private startAllTasks(groupId: string): TaskViewData[] {
        const taskGroup = this.taskGroupStore.getTaskGroup(groupId);

        taskGroup.startAllTasks();

        return taskGroup.getAllTasksViewData();
    }

    private stopTask(groupId: string, uuid: string): TaskViewData[] {
        const taskGroup = this.taskGroupStore.getTaskGroup(groupId);

        taskGroup.stopTask(uuid);

        return taskGroup.getAllTasksViewData();
    }

    private stopAllTasks(groupId: string): TaskViewData[] {
        const taskGroup = this.taskGroupStore.getTaskGroup(groupId);

        taskGroup.stopAllTasks();

        return taskGroup.getAllTasksViewData();
    }

    private editTaskGroupName(groupId: string, newName: string): TaskGroupViewData[] {
        const taskGroup = this.taskGroupStore.getTaskGroup(groupId);

        taskGroup.editName(newName);

        return this.taskGroupStore.getAllTaskGroupsViewData();
    }

    private editTaskGroupStore(groupId: string, newStoreType: StoreType): TaskGroupViewData[] {
        const taskGroup = this.taskGroupStore.getTaskGroup(groupId);

        taskGroup.editStore(newStoreType);

        return this.taskGroupStore.getAllTaskGroupsViewData();
    }

    protected registerListeners(): void {
        ipcMain.handle(TaskGroupChannel.getAllTaskGroups, (_): TaskGroupViewData[] => {
            return this.taskGroupStore.getAllTaskGroupsViewData();
        });

        ipcMain.on(TaskGroupChannel.addTaskGroup, (event, id: string, name: string, storeType: StoreType) => {
            const taskGroups = this.taskGroupStore.addTaskGroup(id, name, storeType);
            if (taskGroups) {
                event.reply(TaskGroupChannel.taskGroupUpdated, taskGroups);
            } else {
                event.reply(TaskGroupChannel.taskGroupError);
            }
        });

        ipcMain.on(TaskGroupChannel.removeTaskGroup, (event, groupId: string) => {
            const taskGroups = this.taskGroupStore.removeTaskGroup(groupId);
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
            const currentTaskGroup = this.taskGroupStore.getTaskGroup(groupId);
            if (currentTaskGroup) {
                const tasks = currentTaskGroup.getAllTasksViewData();
                event.reply(TaskGroupChannel.onTaskGroupSelected, currentTaskGroup.getViewData(), tasks);
            }
        });

        ipcMain.handle(TaskGroupChannel.getTaskFromTaskGroup, (event, groupId: string, id: string): TaskViewData => {
            const currentTaskGroup = this.taskGroupStore.getTaskGroup(groupId);
            const task = currentTaskGroup.getTaskViewData(id);
            return task;
        });

        ipcMain.on(TaskGroupChannel.addTaskToGroup, (event, groupId: string, taskDatas: TaskFormData[]) => {
            const tasks: ITask[] = [];

            for (const taskData of taskDatas) {
                const userProfile = this.profileGroupStore.getProfileGroup(taskData.profile.groupId).getProfile(taskData.profile.id);

                if (userProfile) userProfile.setTaskId({ groupId: groupId, id: taskData.id });

                const proxySet = taskData.groupId ? this.proxyGroupStore.getProxyGroup(taskData.groupId) : null;
                const account = taskData.account
                    ? this.accountGroupStore.getAccountGroup(taskData.account.groupId).getAccount(taskData.account.id)
                    : null;

                tasks.push({
                    productIdentifier: taskData.productIdentifier,
                    productQuantity: taskData.productQuantity,
                    retryDelay: taskData.retryDelay,
                    id: taskData.id,
                    account: account,
                    userProfile: userProfile,
                    proxySet: proxySet,
                    groupId: groupId,
                    isRunning: false,
                    status: { level: 'idle', message: 'Idle' },
                });
            }

            const taskList = this.taskGroupStore.addTaskToGroup(groupId, tasks);

            if (taskList) {
                event.reply(TaskGroupChannel.tasksUpdated, taskList);
            } else {
                event.reply(TaskGroupChannel.taskGroupError, 'Error');
            }
        });

        ipcMain.on(TaskGroupChannel.removeTaskFromGroup, (event, groupId: string, uuids: string[]) => {
            const taskList = this.taskGroupStore.removeTaskFromGroup(groupId, uuids);
            if (taskList) {
                event.reply(TaskGroupChannel.tasksUpdated, taskList);
            } else {
                event.reply(TaskGroupChannel.taskGroupError, 'Error');
            }
        });

        ipcMain.on(TaskGroupChannel.removeAllTasksFromGroup, (event, groupId: string) => {
            const taskList = this.taskGroupStore.removeAllTasksFromGroup(groupId);
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
