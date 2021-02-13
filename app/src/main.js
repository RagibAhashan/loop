const { app, BrowserWindow, ipcMain } = require('electron');
const {
    CAPTCHA_ROUTE,
    NOTIFY_STOP_TASK,
    NOTIFY_START_TASK,
    TASK_STOPPED,
    NOTIFY_CAPTCHA,
    NOTIFY_START_PROXY_TEST,
    NOTIFY_STOP_PROXY_TEST,
    NOTIFY_EDIT_TASK,
    CAPTHA_WINDOW_CLOSED,
    NOTIFY_CAPTCHA_SOLVED,
} = require('./common/Constants');
const captchaWindowManager = require('./core/captcha-window/CaptchaWindowManager');
const taskFactory = require('./core/TaskFactory');
const taskManager = require('./core/TaskManager');
const si = require('systeminformation');
const hash = require('object-hash');

const getSystemUniqueID = async () => {
    try {
        const SYSTEM_ID = await si.system();
        const HASHED_DATA = await hash(SYSTEM_ID);
        return HASHED_DATA;
    } catch (error) {
        throw new Error('Could not fetch system information');
    }
};

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1700,
        height: 830,
        minWidth: 800,
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

    ipcMain.on('new-window', (event, store) => {
        const newWin = new BrowserWindow({
            parent: win,
            width: 690,
            height: 600,
            fullscreenable: false,
            webPreferences: {
                nodeIntegration: true,
            },
            // resizable: false,
        });

        captchaWindowManager.register(store, newWin);

        newWin.loadURL(
            process.env.NODE_ENV === 'development'
                ? `http://localhost:3000/#/${CAPTCHA_ROUTE}/${store}`
                : `file://${__dirname}/../build/index.html#${CAPTCHA_ROUTE}/${store}`,
        );
        newWin.on('close', () => {
            console.log('win got closed');
            event.reply(CAPTHA_WINDOW_CLOSED);
            newWin.destroy();
        });
    });
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
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

ipcMain.on(NOTIFY_START_TASK, (event, uuid, storeName, taskData) => {
    const task = taskManager.getTask(uuid);
    if (task) {
        task.execute();
    } else {
        const newTask = taskFactory.createFootlockerTask(
            storeName,
            uuid,
            taskData.productSKU,
            taskData.sizes,
            taskData.deviceId,
            taskData.profileData,
            taskData.retryDelay,
            taskData.proxyData,
        );

        newTask.on('status', (message) => {
            event.reply(uuid, message);
        });

        newTask.on(TASK_STOPPED, () => {
            event.reply(uuid + TASK_STOPPED, uuid);
        });

        newTask.on(NOTIFY_CAPTCHA, (captcha) => {
            const capWin = captchaWindowManager.getWindow(storeName);
            if (capWin) capWin.webContents.send(storeName + NOTIFY_CAPTCHA, captcha);
        });

        newTask.execute();
    }
});

ipcMain.on(NOTIFY_STOP_TASK, async (event, uuid) => {
    try {
        const currentTask = taskManager.getTask(uuid);
        if (currentTask) {
            currentTask.emit('stop');
        }
    } catch (error) {
        console.log('err', error);
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
    console.log('got notified to start!');
    // start test here
});

ipcMain.on(NOTIFY_STOP_PROXY_TEST, async (event, setName, proxy, credential, store) => {
    try {
        console.log('got notified to stop!');
        // stop test here
    } catch (error) {
        console.log('err', error);
    }
});
