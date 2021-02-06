const { app, BrowserWindow, ipcMain } = require('electron');
const { CAPTCHA_ROUTE } = require('./common/Constants');
const taskFactory = require('./core/TaskFactory');
const taskManager = require('./core/TaskManager');
function createWindow() {
    const win = new BrowserWindow({
        width: 1700,
        height: 830,
        minWidth: 500,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
        },
        // resizable: false,
        // toolbar: false,
        // 'skip-taskbar': true,
        // 'auto-hide-menu-bar': true,
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
ipcMain.on('start-task', (event, uuid) => {
    console.log('starting taks !');
    const { UserProfile, CreditCard } = require('./core/interface/UserProfile');
    const userProfile = new UserProfile('test@gmail.com', '', '', '', '', '', '', '', '', new CreditCard('', '', '', '', ''));

    const flTask = taskFactory.createFootlockerCA(
        uuid,
        'https://www.footlocker.ca/en/product/nike-air-force-1-low-mens/4101086.html',
        '4101086',
        [8.5],
        'deviceId',
        userProfile,
        3500,
    );

    flTask.on('status', (message) => {
        event.reply(uuid, message);
    });

    flTask.on('captcha', (url) => {
        event.reply(uuid + 'captcha', url);
    });

    flTask.execute();
});

ipcMain.on('stop-task', async (event, uuid) => {
    try {
        console.log('yooo stoping that ', uuid);
        const currentTask = taskManager.getTask(uuid);

        currentTask.emit('stop');
    } catch (error) {
        console.log('err', error);
    }
});
