const { app, BrowserWindow, ipcMain } = require('electron');
const { CAPTCHA_ROUTE, NOTIFY_STOP_TASK, NOTIFY_START_TASK, TASK_STOPPED } = require('./common/Constants');
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

    ipcMain.on('new-window', (event, url) => {
        const newWin = new BrowserWindow({
            parent: win,
            width: 400,
            height: 700,
            fullscreenable: false,
            webPreferences: {
                nodeIntegration: true,
            },
        });

        newWin.loadURL(
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/#/' + CAPTCHA_ROUTE
                : `file://${__dirname}/../build/index.html#${CAPTCHA_ROUTE}`,
        );
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
            taskData.productLink,
            taskData.productSKU,
            taskData.sizes,
            taskData.deviceId,
            taskData.profileData,
            taskData.retryDelay,
        );

        newTask.on('status', (message) => {
            event.reply(uuid, message);
        });

        newTask.on('captcha', (url) => {
            event.reply(uuid + 'captcha', url);
        });

        newTask.execute();
    }
});

ipcMain.on(NOTIFY_STOP_TASK, async (event, uuid) => {
    try {
        const currentTask = taskManager.getTask(uuid);
        if (currentTask) currentTask.emit('stop');
        event.reply(uuid + TASK_STOPPED, uuid);
    } catch (error) {
        console.log('err', error);
    }
});
