/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron';

export type Api = {
    send: (channel: string, ...args: any[]) => string;
};

declare global {
    interface Window {
        ElectronBridge: Api;
    }
}

contextBridge.exposeInMainWorld('ElectronBridge', {
    send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
});
