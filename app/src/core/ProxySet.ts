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

    constructor(name: string) {
        this.name = name;
        this.proxies = new Map();
    }

    addProxy(proxies: Proxy[]): void {
        for (const proxy of proxies) {
            this.proxies.set(proxy.host, proxy);
        }
    }

    removeProxy(proxyHosts: string[]): void {
        for (const host of proxyHosts) {
            this.proxies.delete(host);
        }
    }

    removeAllProxies(): void {
        this.proxies = new Map();
    }

    getAllProxies(): Proxy[] {
        return Array.from(this.proxies.values());
    }

    editName(newName: string): void {
        this.name = newName;
    }

    testProxies(proxyHosts: string[]) {
        throw new Error('Method not implemented.');
    }
}
