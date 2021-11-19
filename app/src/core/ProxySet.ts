import { IProxy, Proxy } from './Proxy';
import { RingBuffer } from './RingBufffer';

export interface IProxySet {
    name: string;
}

// Map of name (hostname:port) to proxy
export type ProxyMap = Map<string, Proxy>;

export class ProxySet implements IProxySet {
    name: string;
    proxies: ProxyMap;
    proxiesRingBuffer: RingBuffer<Proxy>;

    constructor(name: string) {
        this.name = name;
        this.proxies = new Map();
        this.proxiesRingBuffer = new RingBuffer();
    }

    private proxyMapToArray(): Proxy[] {
        return Array.from(this.proxies.values());
    }

    // Returns a simple data format for the view
    public getValue(): IProxySet {
        return { name: this.name };
    }

    public pickProxy(): Proxy {
        return this.proxiesRingBuffer.next();
    }

    public addProxy(proxy: Proxy): void {
        this.proxies.set(proxy.host, proxy);
        this.proxiesRingBuffer.fillBuffer(proxy);
    }

    public removeProxy(proxyHost: string): void {
        this.proxies.delete(proxyHost);
        this.proxiesRingBuffer.initBuffer(this.proxyMapToArray());
    }

    public removeAllProxies(): void {
        this.proxies = new Map();
        this.proxiesRingBuffer.clearBuffer();
    }

    public getAllProxies(): IProxy[] {
        const proxies: IProxy[] = [];
        this.proxies.forEach((proxy) => proxies.push(proxy.getValue()));
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
