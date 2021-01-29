const { app, BrowserWindow, ipcMain } = require('electron');
function createWindow() {
    const win = new BrowserWindow({
        width: 1700,
        height: 830,
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

    win.webContents.on('new-window', (event, url, frameName) => {
        if (frameName === 'new-captcha-window') {
            console.log('new window');
            event.preventDefault();
            Object.assign({
                modal: true,
                parent: win,
                width: 100,
                height: 700,
            });
            event.newGuest = new BrowserWindow();
        }
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
    const { FOOTLOCKER_CA_HEADERS } = require('./core/constants/Constants');
    const { UserProfile, CreditCard } = require('./core/interface/UserProfile');
    const { RequestInstance } = require('./core/RequestInstance');
    const { FootLockerTask } = require('./core/footlocker/FootLockerTask');
    const userProfile = new UserProfile('test@gmail.com', '', '', '', '', '', '', '', '', new CreditCard('', '', '', '', ''));
    const axios = new RequestInstance('https://www.footlocker.ca/api', { timestamp: Date.now() }, FOOTLOCKER_CA_HEADERS);
    const fl = new FootLockerTask(
        'https://www.footlocker.ca/en/product/nike-air-force-1-low-mens/4101086.html',
        '4101086',
        [8.5],
        'deviceid',
        axios,
        userProfile,
        3500,
    );

    fl.on('status', (message) => {
        event.reply(uuid, message);
    });

    fl.on('captcha', (url) => {
        event.reply(uuid + 'captcha', url);
    });

    fl.execute();
});

ipcMain.on('stop-task', () => {
    console.log('stopping tasks !');
});
