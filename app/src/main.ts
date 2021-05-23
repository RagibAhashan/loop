import axios from 'axios';
import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import hash from 'object-hash';
import si from 'systeminformation';
import {
    CAPTCHA_ROUTE,
    CAPTHA_WINDOW_CLOSED,
    GET_DATADOME,
    NOTIFY_CAPTCHA,
    NOTIFY_CAPTCHA_SOLVED,
    NOTIFY_EDIT_TASK,
    NOTIFY_START_PROXY_TEST,
    NOTIFY_START_TASK,
    NOTIFY_STOP_PROXY_TEST,
    NOTIFY_STOP_TASK,
    NOTIFY_TASK_STATUS,
    PROXY_TEST_REPLY,
    PROXY_TEST_SUCCEEDED,
    TASK_STATUS,
    TASK_STOP,
    TASK_STOPPED,
    TASK_SUCCESS,
} from './common/Constants';
import { StoreType } from './constants/Stores';
import { captchaWindowManager } from './core/captcha-window/CaptchaWindowManager';
import { COMMONG_HEADERS } from './core/constants/Constants';
import { ProxyFactory } from './core/proxies/ProxyFactory';
import { TaskFactory } from './core/TaskFactory';
import { taskManager } from './core/TaskManager';

let win: BrowserWindow;

const getSystemUniqueID = async (): Promise<string> => {
    try {
        const SYSTEM_ID = await si.system();
        const HASHED_DATA = await hash(SYSTEM_ID);
        return HASHED_DATA;
    } catch (error) {
        throw new Error('Could not fetch system information');
    }
};

const createWindow = () => {
    win = new BrowserWindow({
        width: 1700,
        height: 830,
        minWidth: 960,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    } else {
        win.loadURL(`file://${__dirname}/../build/index.html`);
    }

    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);

    // if main windows is close, close all other captcha window
    win.on('close', () => {
        captchaWindowManager.closeAll();
    });

    ipcMain.on('new-window', (event, store, captcha) => {
        const capWin = captchaWindowManager.getWindow(store);
        if (capWin) {
            // on open send the captcha
            capWin.show();
            return;
        }
        const newWin = new BrowserWindow({
            // parent: win, //dont set parent or else it will not be visible in taskbar
            width: 465,
            height: 630,
            fullscreenable: false,
            webPreferences: {
                nodeIntegration: true,
            },
        });

        newWin.setMenuBarVisibility(false);
        newWin.setAutoHideMenuBar(true);
        captchaWindowManager.register(store, newWin);

        newWin.loadURL(
            process.env.NODE_ENV === 'development'
                ? `http://localhost:3000/#/${CAPTCHA_ROUTE}/${store}`
                : `file://${__dirname}/../build/index.html#${CAPTCHA_ROUTE}/${store}`,
        );
        newWin.on('close', (e) => {
            console.log('cap got closed');
            e.preventDefault();
            event.reply(CAPTHA_WINDOW_CLOSED);
            newWin.hide();
        });
    });
};

app.whenReady().then(async () => {
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    createWindow();
});

app.on('window-all-closed', () => {
    console.log('closing ');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

if (process.platform === 'darwin') {
    app.dock.hide();
}

// IPC EVENTS

ipcMain.on(NOTIFY_START_TASK(StoreType.FootlockerCA), (event, uuid, storeName, taskData) => {
    console.log('starting task !', uuid, storeName);
    const task = taskManager.getTask(uuid);
    if (task) {
        task.updateProxy(taskData.proxyData);
        task.execute();
    } else {
        const newTask = TaskFactory.createFootlockerTask(
            storeName,
            uuid,
            taskData.productSKU,
            taskData.sizes,
            taskData.deviceId,
            taskData.profileData,
            taskData.retryDelay,
            taskData.proxyData,
        );

        newTask.on(TASK_STATUS, (message: any) => {
            event.reply(NOTIFY_TASK_STATUS(storeName), uuid, message); //this event is for retrieving status message even for components that are not rendered
            event.reply(uuid, message); // this one is unique to each component task (update local state)
        });

        newTask.on(TASK_STOPPED, () => {
            event.reply(uuid + TASK_STOPPED, uuid);
        });

        newTask.on(NOTIFY_CAPTCHA, (captcha: any) => {
            const capWin = captchaWindowManager.getWindow(storeName);
            event.reply(storeName + NOTIFY_CAPTCHA, captcha);
            if (capWin) capWin.webContents.send(storeName + NOTIFY_CAPTCHA, captcha);
        });

        newTask.on(TASK_SUCCESS, () => {
            event.reply(uuid + TASK_SUCCESS);
        });

        newTask.execute();
    }
});

ipcMain.on(NOTIFY_STOP_TASK(StoreType.FootlockerCA), async (event, uuid) => {
    try {
        const currentTask = taskManager.getTask(uuid);
        console.log('stopping task', uuid);
        if (currentTask) {
            currentTask.emit(TASK_STOP);
        }
    } catch (error) {
        console.log('err', error);
    }
});

ipcMain.handle(GET_DATADOME, async (event, token, captcha) => {
    try {
        const url = new URL('https://geo.captcha-delivery.com/captcha/check');
        for (const param in captcha.params) {
            console.log(param, ':', captcha.params[param]);
            url.searchParams.append(param, captcha.params[param]);
        }

        console.log(token);
        url.searchParams.append('g-recaptcha-response', token);

        console.log('GEO URL CHECK', url.toString());
        const response = await axios.get(url.toString(), { headers: COMMONG_HEADERS });

        console.log(response.data['cookie']);

        return response.data['cookie'];
    } catch (error) {
        console.log('GEO CAPTCAH ERROR');
    }
});

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

ipcMain.handle('GET-SYSTEM-ID', async (event) => {
    try {
        const ID = await getSystemUniqueID();
        return ID;
    } catch (error) {
        console.log('err', error);
    }
});

ipcMain.on(NOTIFY_EDIT_TASK, async (event, uuid) => {
    try {
        //remove the task so it would be recreated with the new data, hack solution
        taskManager.remove(uuid);
    } catch (error) {
        console.log('err', error);
    }
});

ipcMain.on(NOTIFY_START_PROXY_TEST, (event, setName, proxy, credential, store) => {
    const proxyTest = ProxyFactory.createProxyTest(setName, proxy, credential, store);

    proxyTest.on(PROXY_TEST_SUCCEEDED, (delay: any) => {
        event.reply(PROXY_TEST_REPLY, delay, proxy);
    });

    proxyTest.executeTest();
});

ipcMain.on(NOTIFY_STOP_PROXY_TEST, async (event, setName, proxy, credential, store) => {
    try {
        console.log('got notified to stop!');
        // stop test here
    } catch (error) {
        console.log('err', error);
    }
});
