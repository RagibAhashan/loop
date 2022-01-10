import { AppDatabase } from '@core/app-database';
import { IProxy, Proxy, ProxyFormData, ProxyViewData } from '@core/proxy';
import { ipcMain } from 'electron';
import { EntityId } from './entity-id';
import { ProxySetChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { ProxyFactory } from './proxy-factory';
import { IProxySet, ProxySet, ProxySetViewData } from './proxyset';
import { ProxySetFactory } from './proxyset-factory';
import { TaskGroupManager } from './taskgroup-manager';

const log = debug.extend('ProxySetManager');

export type ProxySetMap = Map<string, ProxySet>;

export class ProxySetManager extends Manager {
    private proxySetMap: ProxySetMap;
    private taskGroupManager: TaskGroupManager;

    constructor(database: AppDatabase, taskGroupManager: TaskGroupManager) {
        super(database);
        this.proxySetMap = new Map();
        this.taskGroupManager = taskGroupManager;
    }

    protected async loadFromDB(): Promise<void> {
        const proxySets = await this.database.loadModelDB<IProxySet[]>('ProxySet');

        const proxies = await this.database.loadModelDB<IProxy[]>('Proxy');

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
        const proxySetsSaved = await this.database.saveModelDB<IProxySet[]>('ProxySet', this.getAllProxySets());
        const proxiesSaved = await this.database.saveModelDB<IProxy[]>('Proxy', this.getAllProxies());

        if (!proxySetsSaved || !proxiesSaved) return false;

        log('ProxySet Saved to DB!');
        return true;
    }

    public pickProxyFromSet(setId: string, taskId: EntityId): Proxy {
        const proxySet = this.getProxySet(setId);

        const proxy = proxySet.pickProxy();
        proxy.setTaskId(taskId);

        return proxy;
    }

    public getProxySet(setId: string): ProxySet {
        const proxySet = this.proxySetMap.get(setId);

        if (!proxySet) throw new Error('getProxySet: Could not find key');

        return proxySet;
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

        const proxySet = this.getProxySet(setId);

        proxySet.getAllProxies().forEach((proxySet) => {
            const taskId = proxySet.taskId;

            if (taskId) {
                const task = this.taskGroupManager.getTaskGroup(taskId.groupId).getTask(taskId.id);
                task.proxy = null;
            }
        });

        this.proxySetMap.delete(setId);

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
        const proxySet = this.getProxySet(setId);

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
        const proxySet = this.getProxySet(setId);

        for (const proxyId of proxyIds) {
            const taskId = proxySet.getProxy(proxyId).taskId;

            if (taskId) {
                const task = this.taskGroupManager.getTaskGroup(taskId.groupId).getTask(taskId.id);
                task.proxy = null;
            }

            proxySet.removeProxy(proxyId);
        }

        return proxySet.getAllProxiesViewData();
    }

    private removeAllProxies(setId: string): ProxySetViewData[] {
        const proxySet = this.getProxySet(setId);

        proxySet.getAllProxies().forEach((proxySet) => {
            const taskId = proxySet.taskId;

            if (taskId) {
                const task = this.taskGroupManager.getTaskGroup(taskId.groupId).getTask(taskId.id);
                task.proxy = null;
            }
        });

        proxySet.removeAllProxies();

        return this.getAllProxySetsViewData();
    }

    private editProxySetName(setId: string, newName: string): ProxySetViewData[] {
        const proxySet = this.getProxySet(setId);

        proxySet.editName(newName);

        return this.getAllProxySetsViewData();
    }

    protected registerListeners(): void {
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

        ipcMain.on(ProxySetChannel.editProxySetName, (event, setId: string, newName: string) => {
            const proxySets = this.editProxySetName(setId, newName);

            if (proxySets) {
                event.reply(ProxySetChannel.proxySetUpdated, proxySets);
            } else {
                event.reply(ProxySetChannel.proxySetError, 'Error');
            }
        });

        ipcMain.on(ProxySetChannel.getProxySetProxies, (event, setId: string) => {
            const currentProxySet = this.getProxySet(setId);
            if (currentProxySet) {
                const proxies = currentProxySet.getAllProxiesViewData();
                event.reply(ProxySetChannel.onProxySetSelected, currentProxySet.getViewData(), proxies);
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
