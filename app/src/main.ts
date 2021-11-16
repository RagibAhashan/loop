import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import hash from 'object-hash';
import si from 'systeminformation';
import {
    ACCESS_GRANTED,
    CAPTHA_WINDOW_CLOSED,
    CAPTHA_WINDOW_OPEN,
    GET_SYSTEM_ID,
    NOTIFY_START_PROXY_TEST,
    NOTIFY_STOP_PROXY_TEST,
    PROXY_TEST_REPLY,
    PROXY_TEST_SUCCEEDED,
    SET_PROXY_CAPTCHA_WINDOW,
    STORE_KEY,
} from './common/Constants';
import { CaptchaType, STORES, StoreType } from './constants/Stores';
import { captchaWindowManager } from './core/captcha-window/CaptchaWindowManager';
import { debug } from './core/Log';
import { ProxyFactory } from './core/proxies/ProxyFactory';
import { TaskGroupManager } from './core/TaskGroupManager';
import { Proxy } from './interfaces/OtherInterfaces';
import UserAgentProvider from './services/UserAgentProvider';
const log = debug.extend('main');
/* eslint-disable @typescript-eslint/no-unused-vars */
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const LICENSE_WINDOW_WEBPACK_ENTRY: string;
declare const GOOGLE_CAPTCHA_WINDOW_WEBPACK_ENTRY: string;
declare const PX_CAPTCHA_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow;

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
    mainWindow = new BrowserWindow({
        width: 1700,
        height: 830,
        minWidth: 960,
        minHeight: 600,

        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    mainWindow.loadURL(LICENSE_WINDOW_WEBPACK_ENTRY);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);

    // if main windows is close, close all other captcha window
    mainWindow.on('close', () => {
        captchaWindowManager.closeAll();
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
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// if (process.platform === 'darwin') {
//     app.dock.hide();
// }

// IPC EVENTS
ipcMain.on(ACCESS_GRANTED, () => {
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
});

const taskGroupManager = new TaskGroupManager();
taskGroupManager.ready();

// const flCAEvents = new FootLockerEvents(StoreType.FootlockerCA);
// flCAEvents.initEvents();

// const flUSEvents = new FootLockerEvents(StoreType.FootlockerUS);
// flUSEvents.initEvents();

// const wUSEvents = new WalmartEvents(StoreType.WalmartUS);
// wUSEvents.initEvents();

// const wCAEvents = new WalmartEvents(StoreType.WalmartCA);
// wCAEvents.initEvents();

ipcMain.on(CAPTHA_WINDOW_OPEN, (event, store: StoreType, proxyHost: string) => {
    const currentStore = STORES[store];

    log('New captcha window open %o', store);

    const capWin = captchaWindowManager.getWindow(store);
    if (capWin) {
        // on open send the captcha
        capWin.show();
        return;
    }

    const newWin = new BrowserWindow({
        // parent: win, //dont set parent or else it will not be visible in taskbar
        width: 465 + 700,
        height: 630,
        fullscreenable: false,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        newWin.webContents.openDevTools();
    }

    newWin.setMenuBarVisibility(false);
    newWin.setAutoHideMenuBar(true);
    newWin.webContents.setUserAgent(UserAgentProvider.randomUserAgent());
    captchaWindowManager.register(store, newWin);

    switch (currentStore.captchaType) {
        case CaptchaType.Google:
            newWin.loadURL(GOOGLE_CAPTCHA_WINDOW_WEBPACK_ENTRY);
            break;
        case CaptchaType.Px:
            newWin.loadURL(PX_CAPTCHA_WINDOW_WEBPACK_ENTRY);
            break;
    }
    newWin.on('close', (e) => {
        log('close');
        e.preventDefault();
        event.reply(CAPTHA_WINDOW_CLOSED(store));
        newWin.hide();
    });

    // When the window is initially created it wont receive the 'show' event.
    // So initially send the store key when it finishes loading.
    newWin.webContents.on('did-finish-load', () => {
        newWin.webContents.send(STORE_KEY, store, 'did finish load');
    });
});

ipcMain.on(SET_PROXY_CAPTCHA_WINDOW, (event, storeType: StoreType, proxy: Proxy) => {
    log('Setting captch window proxy with %O', proxy);
    const capWin = captchaWindowManager.getWindow(storeType);

    if (!capWin) {
        log('No captcha window found');
        return;
    }

    capWin.webContents.session.setProxy({ proxyRules: proxy.host });

    // set proxy auth
    app.on('login', (event, webContents, details, authInfo, callback) => {
        event.preventDefault();
        log('Proxy authentication required');
        callback(proxy.credential.split(':')[0], proxy.credential.split(':')[1]);
    });

    app.removeAllListeners('login');
});

ipcMain.handle(GET_SYSTEM_ID, async (event) => {
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
