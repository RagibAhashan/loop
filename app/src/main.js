const { app, BrowserWindow, ipcMain } = require('electron');
const { Worker } = require('worker_threads');
const path = require('path');
function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
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
let workers = [];

ipcMain.on('start-task', (event, num) => {
    workers = [];
    console.log('starting', num, 'tasks !');
    for (let i = 0; i < num; i++) {
        const worker = new Worker(path.join(__dirname, '/core/WorkerWrapper.js'));

        workers.push(worker);

        worker.on('message', (message) => {
            event.reply('task-reply', message);
        });
    }

    const result = workers.map((w) => w.threadId);
    event.returnValue = result;
});

ipcMain.on('stop-task', () => {
    console.log('stopping tasks !');

    for (let i = 0; i < workers.length; i++) {
        workers[i].terminate();
    }
});
