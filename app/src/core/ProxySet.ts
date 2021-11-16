/*
A proxy set regroups proxies
*/

import { Proxy } from './Proxy';

// Map of name (hostname:port) to proxy
export type ProxyMap = Map<string, Proxy>;

class ProxySet {
    name: string;
    proxies: ProxyMap;

    constructor(name: string) {
        this.name = name;
        this.proxies = new Map();
    }

    removeProxy(proxyHosts: string[]) {
        for (const host of proxyHosts) {
            this.proxies.delete(host);
        }
    }

    editName(newName: string) {
        this.name = newName;
    }

    addProxy(proxies: Proxy[]) {
        for (const proxy of proxies) {
            this.proxies.set(proxy.hos, proxy);
        }
    }
}
