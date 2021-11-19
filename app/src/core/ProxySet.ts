/*
A proxy set regroups proxies
*/

import { Proxy } from './Proxy';

export interface IProxySet {
    name: string;
    proxies: ProxyMap;
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

    pickProxy(): Proxy {
        return this.proxiesRingBuffer.next();
    }

    addProxy(proxy: Proxy): void {
        this.proxies.set(proxy.host, proxy);
        this.proxiesRingBuffer.fillBuffer(proxy);
    }

    removeProxy(proxyHost: string): void {
        this.proxies.delete(proxyHost);
        this.proxiesRingBuffer.initBuffer(this.getAllProxies());
    }

    removeAllProxies(): void {
        this.proxies = new Map();
        this.proxiesRingBuffer.clearBuffer();
    }

    getAllProxies(): Proxy[] {
        return Array.from(this.proxies.values());
    }

    editName(newName: string): void {
        this.name = newName;
    }

    testProxies(proxyHosts: string[]) {
        for (const proxyHost of proxyHosts) {
            const proxy = this.proxies.get(proxyHost);
            proxy.testProxy();
        }
    }
}
