import { AppDatabase } from './app-database';
import { EntityId } from './entity-id';
import { debug } from './log';
import { IProxy, Proxy, ProxyFormData, ProxyViewData } from './proxy';
import { ProxyFactory } from './proxy-factory';
import { IProxyGroup, ProxyGroup, ProxyGroupViewData } from './proxy-group';
import { ProxyGroupFactory } from './proxy-group-factory';

const log = debug.extend('ProxyGroupStore');

export type ProxyGroupMap = Map<string, ProxyGroup>;

export class ProxyGroupStore {
    private database: AppDatabase;
    private proxySetMap: ProxyGroupMap;
    private proxyGroupFactory: ProxyGroupFactory;
    private proxyFactory: ProxyFactory;

    constructor(database: AppDatabase, proxyFactory: ProxyFactory, proxyGroupFactory: ProxyGroupFactory) {
        this.proxySetMap = new Map();
        this.database = database;
        this.proxyFactory = proxyFactory;
        this.proxyGroupFactory = proxyGroupFactory;
    }

    public async loadFromDB(): Promise<void> {
        const proxyGroups = await this.database.loadModelDB<IProxyGroup[]>('ProxyGroup');

        const proxies = await this.database.loadModelDB<IProxy[]>('Proxy');

        if (!proxyGroups || !proxies) return;

        for (const proxyGroup of proxyGroups) {
            this.addProxyGroup(proxyGroup.id, proxyGroup.name);

            const proxiesData: ProxyFormData[] = [];

            proxies.forEach((proxy) => {
                if (proxy.groupId === proxyGroup.id) proxiesData.push({ proxy: `${proxy.host}:${proxy.user}:${proxy.password}`, id: proxy.id });
            });

            this.addProxyToSet(proxyGroup.id, proxiesData);
        }

        log('ProxyGroup Loaded');
    }

    public async saveToDB(): Promise<boolean> {
        const proxyGroupsSaved = await this.database.saveModelDB<IProxyGroup[]>('ProxyGroup', this.getAllProxyGroups());
        const proxiesSaved = await this.database.saveModelDB<IProxy[]>('Proxy', this.getAllProxies());

        if (!proxyGroupsSaved || !proxiesSaved) return false;

        log('ProxyGroup Saved to DB!');
        return true;
    }

    public pickProxyFromSet(setId: string, taskId: EntityId): Proxy {
        const proxySet = this.getProxyGroup(setId);

        const proxy = proxySet.pickProxy(taskId);

        return proxy;
    }

    public getProxyGroup(setId: string): ProxyGroup {
        const proxySet = this.proxySetMap.get(setId);

        if (!proxySet) throw new Error('getProxyGroup: Could not find key');

        return proxySet;
    }

    public addProxyGroup(setId: string, name: string): ProxyGroupViewData[] | null {
        if (this.proxySetMap.has(setId)) {
            log('[ProxyGroup %s already exists]', name);
            return null;
        }

        const newSet = this.proxyGroupFactory.createProxyGroup(setId, name);

        this.proxySetMap.set(setId, newSet);

        return this.getAllProxyGroupsViewData();
    }

    public removeProxyGroup(setId: string): ProxyGroupViewData[] | null {
        if (!this.proxySetMap.has(setId)) {
            log('[ProxyGroup not found to remove]');
            return null;
        }

        this.proxySetMap.delete(setId);

        return this.getAllProxyGroupsViewData();
    }

    public getAllProxyGroups(): ProxyGroup[] {
        return Array.from(this.proxySetMap.values());
    }

    public getAllProxies(): Proxy[] {
        const proxies: Proxy[] = [];
        this.proxySetMap.forEach((proxySet) => proxies.push(...proxySet.getAllProxies()));
        return proxies;
    }

    public getAllProxyGroupsViewData(): ProxyGroupViewData[] {
        const proxyGroups: ProxyGroupViewData[] = [];
        this.proxySetMap.forEach((proxySet) => proxyGroups.push(proxySet.getViewData()));
        return proxyGroups;
    }

    public getAllProxiesViewData(): ProxyViewData[] {
        const proxies: ProxyViewData[] = [];
        this.proxySetMap.forEach((proxySet) => proxies.push(...proxySet.getAllProxiesViewData()));
        return proxies;
    }

    /**
     *
     * @param proxies Array of string containing proxies in this format : host:port:user:pass
     */
    public addProxyToSet(setId: string, proxies: ProxyFormData[]): ProxyViewData[] | null {
        const proxySet = this.getProxyGroup(setId);

        for (const proxyData of proxies) {
            const proxy = this.proxyFactory.createProxy(setId, proxyData);
            proxySet.addProxy(proxy);
        }

        return proxySet.getAllProxiesViewData();
    }

    /**
     *
     * @param hosts Array of string containing proxies full host = hostname:port
     */
    public removeProxyFromSet(setId: string, proxyIds: string[]): ProxyViewData[] | null {
        const proxySet = this.getProxyGroup(setId);

        for (const proxyId of proxyIds) {
            proxySet.removeProxy(proxyId);
        }

        return proxySet.getAllProxiesViewData();
    }

    public removeAllProxies(setId: string): ProxyGroupViewData[] {
        const proxySet = this.getProxyGroup(setId);

        proxySet.removeAllProxies();

        return this.getAllProxyGroupsViewData();
    }
}
