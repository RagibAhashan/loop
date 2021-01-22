const { app, BrowserWindow } = require('electron');
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
