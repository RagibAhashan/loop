import { StoreType } from '@constants/Stores';
import { BrowserWindow } from 'electron';

/*
Map that stores captcha windows
*/
class CaptchaWindowManager {
    windows: Map<string, BrowserWindow>;
    constructor() {
        // Map<string, BrowserWindow>
        this.windows = new Map();
    }

    getWindow(storeName: StoreType): BrowserWindow | undefined {
        return this.windows.get(storeName);
    }

    register(storeName: StoreType, window: BrowserWindow): void {
        this.windows.set(storeName, window);
    }

    closeAll(): void {
        this.windows.forEach((win) => win.destroy());
    }
}

export const captchaWindowManager = new CaptchaWindowManager();
