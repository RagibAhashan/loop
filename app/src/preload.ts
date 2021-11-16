/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron';

export type Api = {
    send: (channel: string, ...args: any[]) => void;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    on: (channel: string, listener: any) => void;
    once: (channel: string, listener: any) => void;
    removeAllListeners: (channel: string) => void;
    removeListener: (channel: string, listener: (...args: any[]) => void) => void;
};

export type TaskGroupApi = {
    getAllGroups: any;
    getAllTasks: any;
    createGroup: any;
    removeGroup: any;
    editGroup: any;
};

declare global {
    interface Window {
        ElectronBridge: Api;
    }
}

contextBridge.exposeInMainWorld('ElectronBridge', {
    send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    on: (channel: string, listener: any) => ipcRenderer.on(channel, listener),
    once: (channel: string, listener: any) => ipcRenderer.once(channel, listener),
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
    removeListener: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.removeListener(channel, listener),
});
