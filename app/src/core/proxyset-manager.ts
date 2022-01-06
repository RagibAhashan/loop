import { AppDatabase } from '@core/app-database';
import { Proxy, ProxyFormData, ProxyViewData } from '@core/proxy';
import { ipcMain } from 'electron';
import { ProxySetChannel } from './ipc-channels';
import { debug } from './log';
import { ProxyFactory } from './proxy-factory';
import { ProxySet, ProxySetViewData } from './proxyset';
import { ProxySetFactory } from './proxyset-factory';

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
        const proxySets = await this.database.loadModelDB<ProxySet>('ProxySet');

        const proxies = await this.database.loadModelDB<Proxy>('Proxy');

        if (!proxySets || !proxies) return;

        for (const proxySet of proxySets) {
            this.addProxySet(proxySet.id, proxySet.name);

            const proxiesData: ProxyFormData[] = [];

            proxies.forEach((proxy) => {
                if (proxy.proxySetId === proxySet.id) proxiesData.push({ proxy: `${proxy.host}:${proxy.user}:${proxy.password}`, id: proxy.id });
            });

            this.addProxyToSet(proxySet.id, proxiesData);
        }

        log('ProxySet Loaded');
    }

    public async saveToDB(): Promise<boolean> {
        const proxySetsSaved = await this.database.saveModelDB<ProxySet>('ProxySet', this.getAllProxySets());
        const proxiesSaved = await this.database.saveModelDB<Proxy>('Proxy', this.getAllProxies());

        if (!proxySetsSaved || !proxiesSaved) return false;

        log('ProxySet Saved to DB!');
        return true;
    }

    public pickProxyFromSet(setId: string): Proxy {
        const proxySet = this.proxySetMap.get(setId);
        return proxySet.pickProxy();
    }

    private getProxySet(setId: string): ProxySet | undefined {
        return this.proxySetMap.get(setId);
    }

    private addProxySet(setId: string, name: string): ProxySetViewData[] | null {
        if (this.proxySetMap.has(setId)) {
            log('[ProxySet %s already exists]', name);
            return null;
        }

        const newSet = ProxySetFactory.createProxySet(setId, name);

        this.proxySetMap.set(setId, newSet);

        return this.getAllProxySetsViewData();
    }

    private removeProxySet(setId: string): ProxySetViewData[] | null {
        if (!this.proxySetMap.has(setId)) {
            log('[ProxySet not found to remove]');
            return null;
        }

        this.proxySetMap.delete(setId);
        return this.getAllProxySetsViewData();
    }

    private removeAllProxies(setId: string): ProxySetViewData[] | null {
        if (!this.proxySetMap.has(setId)) {
            log('[ProxySet not found]');
            return null;
        }

        const proxySet = this.proxySetMap.get(setId);

        proxySet.removeAllProxies();

        return this.getAllProxySetsViewData();
    }

    private getAllProxySets(): ProxySet[] {
        return Array.from(this.proxySetMap.values());
    }

    private getAllProxies(): Proxy[] {
        const proxies: Proxy[] = [];
        this.proxySetMap.forEach((proxySet) => proxies.push(...proxySet.getAllProxies()));
        return proxies;
    }

    private getAllProxySetsViewData(): ProxySetViewData[] {
        const proxySets: ProxySetViewData[] = [];
        this.proxySetMap.forEach((proxySet) => proxySets.push(proxySet.getViewData()));
        return proxySets;
    }

    private getAllProxiesViewData(): ProxyViewData[] {
        const proxies: ProxyViewData[] = [];
        this.proxySetMap.forEach((proxySet) => proxies.push(...proxySet.getAllProxiesViewData()));
        return proxies;
    }

    /**
     *
     * @param proxies Array of string containing proxies in this format : host:port:user:pass
     */
    private addProxyToSet(setId: string, proxies: ProxyFormData[]): ProxyViewData[] | null {
        if (!this.proxySetMap.has(setId)) {
            log('[ProxySet not found]');
            return null;
        }

        const proxySet = this.proxySetMap.get(setId);

        for (const proxyData of proxies) {
            const proxy = ProxyFactory.createProxy(setId, proxyData);
            proxySet.addProxy(proxy);
        }

        return proxySet.getAllProxiesViewData();
    }

    /**
     *
     * @param hosts Array of string containing proxies full host = hostname:port
     */
    private removeProxyFromSet(setId: string, proxyIds: string[]): ProxyViewData[] | null {
        if (!this.proxySetMap.has(setId)) {
            log('[ProxySetnot found]');
            return null;
        }
        const proxySet = this.proxySetMap.get(setId);

        for (const proxyId of proxyIds) {
            proxySet.removeProxy(proxyId);
        }

        return proxySet.getAllProxiesViewData();
    }

    private editProxySetName(setId: string, newName: string): void {
        const proxySet = this.proxySetMap.get(setId);
        proxySet.editName(newName);
    }

    private registerListeners(): void {
        ipcMain.handle(ProxySetChannel.getAllProxySets, (_): ProxySetViewData[] => {
            return this.getAllProxySetsViewData();
        });

        ipcMain.on(ProxySetChannel.addProxySet, (event, id: string, name: string) => {
            const proxySets = this.addProxySet(id, name);
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets, 'Proxy Set Created');
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Proxy set already exists');
            }
        });

        ipcMain.on(ProxySetChannel.removeProxySet, (event, setId: string) => {
            const proxySets = this.removeProxySet(setId);
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets, 'Proxy Set Deleted');
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxySetChannel.removeAllProxiesFromProxySet, (event, setId: string) => {
            const proxySets = this.removeAllProxies(setId);
            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets, 'All Proxy Set Deleted');
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxySetChannel.getProxySetProxies, (event, setId: string) => {
            const currentProxySet = this.getProxySet(setId);
            if (currentProxySet) {
                const proxies = currentProxySet.getAllProxiesViewData();
                event.reply(ProxySetChannel.onSelectedProxySet, currentProxySet.getViewData(), proxies);
            }
        });

        ipcMain.on(ProxySetChannel.addProxyToSet, (event, setId: string, proxies: ProxyFormData[]) => {
            const proxyList = this.addProxyToSet(setId, proxies);
            if (proxyList) {
                event.reply(ProxySetChannel.proxiesUpdated, proxyList);
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxySetChannel.removeProxyFromSet, (event, setId: string, proxyIds: string[]) => {
            const proxyList = this.removeProxyFromSet(setId, proxyIds);
            if (proxyList) {
                event.reply(ProxySetChannel.proxiesUpdated, proxyList);
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });
    }
}
