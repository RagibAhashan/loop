class CaptchaWindowManager {
    constructor() {
        // Map<string, BrowserWindow>
        this.windows = new Map();
    }

    getWindow(storeName) {
        return this.windows.get(storeName);
    }

    register(storeName, window) {
        this.windows.set(storeName, window);
    }

    closeAll() {
        this.windows.forEach((win) => win.destroy());
    }
}

module.exports = new CaptchaWindowManager();
