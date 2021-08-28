import { ipcMain } from 'electron';
import { NOTIFY_ADD_TASK, NOTIFY_EDIT_TASK, NOTIFY_START_TASK } from '../common/Constants';
import {
    NOTIFY_CAPTCHA,
    NOTIFY_ON_START_INIT_TASK,
    NOTIFY_STOP_TASK,
    NOTIFY_TASK_STATUS,
    TASK_STATUS,
    TASK_STOP,
    TASK_STOPPED,
    TASK_SUCCESS,
} from './../common/Constants';
import { StoreType } from './../constants/Stores';
import { TaskData } from './../interfaces/TaskInterfaces';
import { captchaWindowManager } from './captcha-window/CaptchaWindowManager';
import { Task } from './Task';
import { taskManager } from './TaskManager';

export abstract class BaseStoreEvents {
    protected readonly storeType;

    constructor(storeType: StoreType) {
        this.storeType = storeType;
    }

    public initEvents() {
        this.editTaskEvent();
        this.addTaskEvent();
        this.stopTaskEvent();
        this.startTaskEvent();
        this.onStartInitTaskEvent();
    }

    protected abstract newTask(taskData: TaskData): Task;

    protected createTask(event: Electron.IpcMainEvent, taskData: TaskData): Task {
        const newTask = this.newTask(taskData);

        const { uuid } = taskData;

        newTask.on(TASK_STATUS, (message: any) => {
            event.reply(NOTIFY_TASK_STATUS(this.storeType), uuid, message); //this event is for retrieving status message even for components that are not rendered
            event.reply(uuid, message); // this one is unique to each component task (update local state)
        });

        newTask.on(TASK_STOPPED, () => {
            event.reply(uuid + TASK_STOPPED, uuid);
        });

        newTask.on(NOTIFY_CAPTCHA, (captcha: any) => {
            const capWin = captchaWindowManager.getWindow(this.storeType);
            event.reply(this.storeType + NOTIFY_CAPTCHA, captcha);
            if (capWin) capWin.webContents.send(this.storeType + NOTIFY_CAPTCHA, captcha);
        });

        newTask.on(TASK_SUCCESS, () => {
            event.reply(uuid + TASK_SUCCESS);
        });

        return newTask;
    }

    protected onStartInitTaskEvent(): void {
        ipcMain.on(NOTIFY_ON_START_INIT_TASK(this.storeType), (event, tasks: TaskData[]) => {
            tasks.forEach((task) => {
                console.log('init', task.uuid);
                this.createTask(event, task);
            });
        });
    }

    protected addTaskEvent(): void {
        ipcMain.on(NOTIFY_ADD_TASK(this.storeType), (event, taskData: TaskData) => {
            console.log('adding task !', taskData.uuid);
            this.createTask(event, taskData);
        });
    }

    protected startTaskEvent(): void {
        ipcMain.on(NOTIFY_START_TASK(this.storeType), (event, taskData: TaskData) => {
            console.log('starting task ! for store', this.storeType, taskData);

            let task = taskManager.getTask(taskData.uuid);

            if (!task) task = this.createTask(event, taskData);

            task.execute();
        });
    }

    protected stopTaskEvent() {
        ipcMain.on(NOTIFY_STOP_TASK(this.storeType), async (event, uuid) => {
            try {
                const currentTask = taskManager.getTask(uuid);
                console.log('stopping task', uuid);
                if (currentTask) currentTask.emit(TASK_STOP);
            } catch (error) {
                console.log('Error stoping task', error);
            }
        });
    }

    protected editTaskEvent() {
        console.log('edit event create !', NOTIFY_EDIT_TASK(this.storeType));
        ipcMain.on(NOTIFY_EDIT_TASK(this.storeType), async (event, uuid: string, updatedTask) => {
            try {
                console.log('recevied edit event from', uuid, 'with', updatedTask, this.storeType);
                const task = taskManager.getTask(uuid);

                console.log('got task', task);
                if (task) task.updateData(updatedTask);
            } catch (error) {
                console.log('Error editing task', error);
            }
        });
    }
}