import { ipcMain } from 'electron';
import { ProxySetChannel } from './IpcChannels';
import { debug } from './Log';
import { IProxySet, ProxySet } from './ProxySet';
import { ProxySetFactory } from './ProxySetFactory';

const log = debug.extend('ProxySetManager');
export type ProxySetMap = Map<string, ProxySet>;
export class ProxySetManager {
    private proxySetMap: ProxySetMap;

    constructor() {
        this.proxySetMap = new Map();
    }

    public ready(): void {
        this.registerListeners();
    }

    private addProxySet(name: string): IProxySet[] | null {
        if (this.proxySetMap.has(name)) {
            log('[ProxySet %s already exists]', name);
            return null;
        }

        const newSet = ProxySetFactory.createProxySet(name);

        this.proxySetMap.set(name, newSet);
        return this.getAllProxySets();
    }

    private removeProxySet(name: string): IProxySet[] | null {
        if (!this.proxySetMap.has(name)) {
            log('[ProxySet %s not found]', name);
            return null;
        }

        this.proxySetMap.delete(name);
        return this.getAllProxySets();
    }

    private removeAllProxies(name: string): IProxySet[] | null {
        if (!this.proxySetMap.has(name)) {
            log('[ProxySet %s not found]', name);
            return null;
        }

        const proxySet = this.proxySetMap.get(name);
        proxySet.removeAllProxies();
        return this.getAllProxySets();
    }

    private getProxySet(name: string): ProxySet | undefined {
        return this.proxySetMap.get(name);
    }

    private getAllProxySets(): IProxySet[] {
        return Array.from(this.proxySetMap.values());
    }

    private editProxySetName(oldName: string, newName: string): void {
        const proxySet = this.proxySetMap.get(oldName);
        proxySet.editName(newName);
    }

    private registerListeners(): void {
        ipcMain.handle(ProxySetChannel.getAllProxySets, (_) => {
            return this.getAllProxySets();
        });

        ipcMain.on(ProxySetChannel.addProxySet, (event, name: string) => {
            const proxySets = this.addProxySet(name);
            console.log('adding proxy sets', proxySets);
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets);
            } else {
                event.reply(ProxySetChannel.proxySetError);
            }
        });

        ipcMain.on(ProxySetChannel.removeProxySet, (event, name: string) => {
            const proxySets = this.removeProxySet(name);
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets);
            } else {
                event.reply(ProxySetChannel.proxySetError);
            }
        });

        ipcMain.on(ProxySetChannel.removeAllProxiesFromProxySet, (event, name: string) => {
            const proxySets = this.removeAllProxies(name);
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets);
            } else {
                event.reply(ProxySetChannel.proxySetError);
            }
        });

        ipcMain.on(ProxySetChannel.getProxySetProxies, (event, name: string) => {
            const currentProxySet = this.getProxySet(name);
            if (currentProxySet) {
                const proxies = currentProxySet.getAllProxies();
                event.reply(ProxySetChannel.proxiesLoaded, proxies);
            }
        });
    }
}
