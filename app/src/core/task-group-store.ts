import { StoreType } from '@constants/stores';
import { AppDatabase } from './app-database';
import { debug } from './log';
import { ITask, Task, TaskFormData, TaskViewData } from './task';
import { TaskFactory } from './task-factory';
import { ITaskGroup, TaskGroup, TaskGroupViewData } from './task-group';
import { TaskGroupFactory } from './task-group-factory';

const log = debug.extend('TaskGroupStore');

export type TaskGroupMap = Map<string, TaskGroup>;

export class TaskGroupStore {
    private taskGroupMap: TaskGroupMap;
    private taskGroupFactory: TaskGroupFactory;
    private taskFactory: TaskFactory;
    private database: AppDatabase;

    constructor(database: AppDatabase, taskGroupFactory: TaskGroupFactory, taskFactory: TaskFactory) {
        this.taskGroupMap = new Map();
        this.taskGroupFactory = taskGroupFactory;
        this.taskFactory = taskFactory;
        this.database = database;
    }

    public async loadFromDB(): Promise<void> {
        const taskGroups = await this.database.loadModelDB<ITaskGroup[]>('TaskGroup');
        const tasks = await this.database.loadModelDB<ITask[]>('Task');

        if (!taskGroups || !tasks) return;

        for (const taskGroup of taskGroups) {
            this.addTaskGroup(taskGroup.id, taskGroup.name, taskGroup.storeType);

            // TODO Review this logic
            const taskDatas: TaskFormData[] = [];

            tasks.forEach((task) => {
                const taskFormData = this.taskInterfaceToTaskForm(task);
                if (task.groupId === taskGroup.id) taskDatas.push(taskFormData);
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
            profile: { groupId: task.userProfile.groupId, id: task.userProfile.id },
            proxyGroupId: task.proxyGroup ? task.proxyGroup.id : '',
            productIdentifier: task.productIdentifier,
            id: task.id,
            productQuantity: task.productQuantity,
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

    public addTaskGroup(id: string, name: string, storeType: StoreType): TaskGroupViewData[] | null {
        if (this.findTaskGroupByName(name)) {
            log('[Group %s already exists]', name);
            return null;
        }

        const newGroup = this.taskGroupFactory.createTaskGroup(id, name, storeType);

        this.taskGroupMap.set(id, newGroup);

        return this.getAllTaskGroupsViewData();
    }

    public removeTaskGroup(groupId: string): TaskGroupViewData[] | null {
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

    public findTaskGroupByName(name: string): boolean {
        return Array.from(this.taskGroupMap.values()).some((taskGroup) => taskGroup.name === name);
    }

    public getAllTaskGroupsViewData(): TaskGroupViewData[] {
        const taskGroups: TaskGroupViewData[] = [];
        this.taskGroupMap.forEach((taskGroup) => taskGroups.push(taskGroup.getViewData()));
        return taskGroups;
    }

    public getAllTaskGroups(): TaskGroup[] {
        return Array.from(this.taskGroupMap.values());
    }

    public getAllTasks(): Task[] {
        const tasks: Task[] = [];
        this.taskGroupMap.forEach((taskGroup) => tasks.push(...taskGroup.getAllTasks()));
        return tasks;
    }

    public addTaskToGroup(groupId: string, tasks: TaskFormData[]): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        for (const task of tasks) {
            const newTask = this.taskFactory.createTask(taskGroup.storeType, task, groupId);
            taskGroup.addTasks(newTask);
        }

        return taskGroup.getAllTasksViewData();
    }

    public removeTaskFromGroup(groupId: string, taskIds: string[]): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        for (const id of taskIds) {
            taskGroup.getTask(id).userProfile.setTaskId(null);
            taskGroup.getTask(id).account?.setTaskId(null);
            taskGroup.getTask(id).proxy?.setTaskId(null);

            taskGroup.removeTask(id);
        }

        return taskGroup.getAllTasksViewData();
    }

    public removeAllTasksFromGroup(groupId: string): TaskViewData[] {
        const taskGroup = this.getTaskGroup(groupId);

        taskGroup.getAllTasks().forEach((task) => {
            task.userProfile.setTaskId(null);
            task.account?.setTaskId(null);
            task.proxy?.setTaskId(null);
        });

        taskGroup.removeAllTasks();

        return taskGroup.getAllTasksViewData();
    }
}
