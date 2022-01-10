import { Proxy, ProxyViewData } from './proxy';
import { RingBuffer } from './ring-buffer';
import { Viewable } from './viewable';

export const proxySetPrefix = 'proxset';

export interface ProxySetFormData {
    id: string;
    name: string;
}

export interface ProxySetViewData {
    id: string;
    name: string;
    proxies: ProxyViewData[];
}

export interface IProxySet {
    id: string;
    name: string;
}

// Map of name (hostname:port) to proxy
export type ProxyMap = Map<string, Proxy>;

export class ProxySet implements IProxySet, Viewable<ProxySetViewData> {
    id: string;
    name: string;
    proxies: ProxyMap;
    proxiesRingBuffer: RingBuffer<Proxy>;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.proxies = new Map();
        this.proxiesRingBuffer = new RingBuffer();
    }

    private proxyMapToArray(): Proxy[] {
        return Array.from(this.proxies.values());
    }

    public getViewData(): ProxySetViewData {
        return { id: this.id, name: this.name, proxies: this.getAllProxiesViewData() };
    }

    public pickProxy(): Proxy {
        const proxy = this.proxiesRingBuffer.next();
        return proxy;
    }

    public addProxy(proxy: Proxy): void {
        this.proxies.set(proxy.id, proxy);
        this.proxiesRingBuffer.fillBuffer(proxy);
    }

    public getProxy(id: string): Proxy {
        const proxy = this.proxies.get(id);

        if (!proxy) throw new Error('getProxy: Could not find key');

        return proxy;
    }

    public removeProxy(proxyId: string): void {
        this.proxies.delete(proxyId);
        this.proxiesRingBuffer.initBuffer(this.proxyMapToArray());
    }

    public removeAllProxies(): void {
        this.proxies = new Map();
        this.proxiesRingBuffer.clearBuffer();
    }

    public getAllProxies(): Proxy[] {
        return Array.from(this.proxies.values());
    }

    public getAllProxiesViewData(): ProxyViewData[] {
        const proxies: ProxyViewData[] = [];
        this.proxies.forEach((proxy) => proxies.push(proxy.getViewData()));
        return proxies;
    }

    public editName(newName: string): void {
        this.name = newName;
    }

    public testProxies(proxyIDs: string[]) {
        for (const proxyId of proxyIDs) {
            const proxy = this.getProxy(proxyId);
            proxy.testProxy();
        }
    }
}
