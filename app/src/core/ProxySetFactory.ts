import { debug } from './Log';
import { ProxySet } from './ProxySet';

const log = debug.extend('ProxySetFactory');

export class ProxySetFactory {
    public static createProxySet(id: string, name: string): ProxySet {
        const proxySet = new ProxySet(id, name);
        return proxySet;
    }
}
