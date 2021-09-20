import axios from 'axios';
import { ipcMain } from 'electron';
import { Task } from '../Task';
import { GET_DATADOME, NOTIFY_CAPTCHA_SOLVED } from './../../common/Constants';
import { FLTaskData, TaskData } from './../../interfaces/TaskInterfaces';
import { BaseStoreEvents } from './../BaseStoreEvents';
import { COMMON_HEADERS } from './../constants/Constants';
import { TaskFactory } from './../TaskFactory';
import { taskManager } from './../TaskManager';
export class FootLockerEvents extends BaseStoreEvents {
    public initEvents() {
        super.initEvents();
        this.dataDomeEvent();
        this.captchaSolvedEvent();
    }

    protected newTask(taskData: TaskData): Task {
        return TaskFactory.createFootlockerTask(this.storeType, taskData as FLTaskData);
    }

    private dataDomeEvent() {
        ipcMain.handle(GET_DATADOME(this.storeType), async (event, token, captcha) => {
            try {
                const url = new URL('https://geo.captcha-delivery.com/captcha/check');
                for (const param in captcha.params) {
                    url.searchParams.append(param, captcha.params[param]);
                }

                url.searchParams.append('g-recaptcha-response', token);

                console.log('GEO URL CHECK', url.toString());
                const response = await axios.get(url.toString(), { headers: COMMON_HEADERS });

                console.log(response.data['cookie']);

                return response.data['cookie'];
            } catch (error) {
                console.log('GEO CAPTCAH ERROR');
            }
        });
    }

    private captchaSolvedEvent() {
        ipcMain.on(NOTIFY_CAPTCHA_SOLVED, async (event, uuid, datadome) => {
            try {
                const currentTask = taskManager.getTask(uuid);
                if (currentTask) {
                    currentTask.emit(NOTIFY_CAPTCHA_SOLVED, datadome);
                }
            } catch (error) {
                console.log('err', error);
            }
        });
    }
}
