import { AppDatabase } from '@core/AppDatabase';
import { Proxy } from '@core/Proxy';
import { ipcMain } from 'electron';
import { ProxySetChannel } from './IpcChannels';
import { debug } from './Log';
import { IProxy } from './Proxy';
import { ProxyFactory } from './ProxyFactory';
import { IProxySet, ProxySet } from './ProxySet';
import { ProxySetFactory } from './ProxySetFactory';

const log = debug.extend('ProxySetManager');
export type ProxySetMap = Map<string, ProxySet>;
export class ProxySetManager {
    private proxySetMap: ProxySetMap;

    private database: AppDatabase;

    constructor(database: AppDatabase) {
        this.proxySetMap = new Map();
        this.database = database;
    }

    public ready(): void {
        this.registerListeners();
        this.loadFromDB();
    }

    public async loadFromDB(): Promise<void> {
        const proxySets = await this.database.loadModelDB<IProxySet>('ProxySet');

        const proxies = await this.database.loadModelDB<IProxy>('Proxy');

        if (!proxySets || !proxies) return;

        for (const proxySet of proxySets) {
            this.addProxySet(proxySet.name);
            this.addProxyToSet(
                proxySet.name,
                proxies.map((proxy) => `${proxy.host}:${proxy.user}:${proxy.password}`),
            );
        }

        log('ProxySet Loaded');
    }

    public async saveToDB(): Promise<boolean> {
        const proxySetsSaved = await this.database.saveModelDB<IProxySet>('ProxySet', this.getAllProxySets());
        const proxiesSaved = await this.database.saveModelDB<IProxy>('Proxy', this.getAllProxies());

        if (!proxySetsSaved || !proxiesSaved) return false;

        log('ProxySet Saved to DB!');
        return true;
    }

    public pickProxyFromSet(proxySetName: string): Proxy {
        const proxySet = this.proxySetMap.get(proxySetName);
        return proxySet.pickProxy();
    }

    private getProxySet(name: string): ProxySet | undefined {
        return this.proxySetMap.get(name);
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

    private getAllProxySets(): IProxySet[] {
        const proxySets: IProxySet[] = [];
        this.proxySetMap.forEach((proxySet) => proxySets.push(proxySet.getValue()));
        return proxySets;
    }

    private getAllProxies(): IProxy[] {
        const proxies: IProxy[] = [];
        this.proxySetMap.forEach((proxySet) => proxies.push(...proxySet.getAllProxies()));
        return proxies;
    }

    /**
     *
     * @param hosts Array of string containing proxies in this format : host:port:user:pass
     */
    private addProxyToSet(setName: string, proxies: string[]): IProxy[] | null {
        if (!this.proxySetMap.has(setName)) {
            log('[ProxySet %s not found]', name);
            return null;
        }

        const proxySet = this.proxySetMap.get(setName);

        for (const proxyStr of proxies) {
            const proxy = ProxyFactory.createProxy(proxyStr, setName);
            proxySet.addProxy(proxy);
        }

        return proxySet.getAllProxies();
    }

    /**
     *
     * @param hosts Array of string containing proxies full host = hostname:port
     */
    private removeProxyFromSet(setName: string, proxiesHost: string[]): IProxy[] | null {
        if (!this.proxySetMap.has(setName)) {
            log('[ProxySet %s not found]', name);
            return null;
        }
        const proxySet = this.proxySetMap.get(setName);

        for (const proxyHost of proxiesHost) {
            proxySet.removeProxy(proxyHost);
        }

        return proxySet.getAllProxies();
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
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets, 'Proxy set created');
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Proxy set already exists');
            }
        });

        ipcMain.on(ProxySetChannel.removeProxySet, (event, name: string) => {
            const proxySets = this.removeProxySet(name);
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets, 'Proxy set deleted');
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxySetChannel.removeAllProxiesFromProxySet, (event, name: string) => {
            const proxySets = this.removeAllProxies(name);
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets, 'All Proxy set deleted');
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxySetChannel.getProxySetProxies, (event, name: string) => {
            const currentProxySet = this.getProxySet(name);
            if (currentProxySet) {
                const proxies = currentProxySet.getAllProxies();
                event.reply(ProxySetChannel.onSelectedProxySet, currentProxySet.name, proxies);
            }
        });

        ipcMain.on(ProxySetChannel.addProxyToSet, (event, name: string, proxies: string[]) => {
            const proxyList = this.addProxyToSet(name, proxies);
            if (proxyList) {
                event.reply(ProxySetChannel.proxiesUpdated, proxyList);
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxySetChannel.removeProxyFromSet, (event, name: string, proxyHosts: string[]) => {
            const proxyList = this.removeProxyFromSet(name, proxyHosts);
            if (proxyList) {
                event.reply(ProxySetChannel.proxiesUpdated, proxyList);
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });
    }
}
