import { app, BrowserWindow, ipcMain } from 'electron';
import hash from 'object-hash';
import si from 'systeminformation';
import {
    CAPTCHA_ROUTE,
    CAPTHA_WINDOW_CLOSED,
    NOTIFY_START_PROXY_TEST,
    NOTIFY_STOP_PROXY_TEST,
    PROXY_TEST_REPLY,
    PROXY_TEST_SUCCEEDED,
} from './common/Constants';
import { StoreType } from './constants/Stores';
import { captchaWindowManager } from './core/captcha-window/CaptchaWindowManager';
import { FootLockerEvents } from './core/footlocker/FootLockerEvents';
import { ProxyFactory } from './core/proxies/ProxyFactory';
import { WalmartEvents } from './core/walmart/WalmartEvents';

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
    // installExtension(REDUX_DEVTOOLS)
    //     .then((name) => console.log(`Added Extension:  ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err));

    // installExtension(REACT_DEVELOPER_TOOLS)
    //     .then((name) => console.log(`Added Extension:  ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err));
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

const flCAEvents = new FootLockerEvents(StoreType.FootlockerCA);
flCAEvents.initEvents();

const flUSEvents = new FootLockerEvents(StoreType.FootlockerUS);
flUSEvents.initEvents();

const wUSEvents = new WalmartEvents(StoreType.WalmartUS);
wUSEvents.initEvents();

ipcMain.handle('GET-SYSTEM-ID', async (event) => {
    try {
        const ID = await getSystemUniqueID();
        return ID;
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
