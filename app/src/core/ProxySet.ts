import { Proxy, ProxyViewData } from './Proxy';
import { RingBuffer } from './RingBuffer';
import { Viewable } from './Viewable';

export const proxySetPrefix = 'proxset';

export interface ProxySetFormData {
    id: string;
    name: string;
}

export interface ProxySetViewData {
    id: string;
    name: string;
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
        return { id: this.id, name: this.name };
    }

    public pickProxy(): Proxy {
        return this.proxiesRingBuffer.next();
    }

    public addProxy(proxy: Proxy): void {
        this.proxies.set(proxy.id, proxy);
        this.proxiesRingBuffer.fillBuffer(proxy);
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

    public testProxies(proxyHosts: string[]) {
        for (const proxyHost of proxyHosts) {
            const proxy = this.proxies.get(proxyHost);
            proxy.testProxy();
        }
    }
}
