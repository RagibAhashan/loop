const { app, BrowserWindow, ipcMain } = require('electron');
const {
    CAPTCHA_ROUTE,
    NOTIFY_STOP_TASK,
    NOTIFY_START_TASK,
    TASK_STOPPED,
    NOTIFY_CAPTCHA,
    NOTIFY_START_PROXY,
    NOTIFY_STOP_PROXY,
    NOTIFY_EDIT_TASK,
    CAPTHA_WINDOW_CLOSED,
} = require('./common/Constants');
const captchaWindowManager = require('./core/captcha-window/CaptchaWindowManager');
const taskFactory = require('./core/TaskFactory');
const taskManager = require('./core/TaskManager');

function createWindow() {
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
            width: 400,
            height: 700,
            fullscreenable: false,
            webPreferences: {
                nodeIntegration: true,
            },
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
}

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

ipcMain.on(NOTIFY_EDIT_TASK, async (event, uuid) => {
    try {
        //remove the task so it would be recreated with the new data, hack solution
        taskManager.remove(uuid);
    } catch (error) {
        console.log('err', error);
    }
});

ipcMain.on(NOTIFY_START_PROXY, (event, setName, proxy, credential, store) => {
    console.log('got notified to start!');
    // start test here
});

ipcMain.on(NOTIFY_STOP_PROXY, async (event, setName, proxy, credential, store) => {
    try {
        console.log('got notified to stop!');
        // stop test here
    } catch (error) {
        console.log('err', error);
    }
});
