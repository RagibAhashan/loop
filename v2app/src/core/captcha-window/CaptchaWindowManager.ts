import { BrowserWindow } from 'electron';
class CaptchaWindowManager {
    windows: Map<string, BrowserWindow>;
    constructor() {
        // Map<string, BrowserWindow>
        this.windows = new Map();
    }

    getWindow(storeName: string): BrowserWindow | undefined {
        return this.windows.get(storeName);
    }

    register(storeName: string, window: BrowserWindow): void {
        this.windows.set(storeName, window);
    }

    closeAll(): void {
        this.windows.forEach((win) => win.destroy());
    }
}

export const captchaWindowManager = new CaptchaWindowManager();
