import { debug } from './Log';
import { ProxySet } from './ProxySet';

const log = debug.extend('ProxySetFactory');

export class ProxySetFactory {
    public static createProxySet(name: string): ProxySet {
        const proxySet = new ProxySet(name);
        return proxySet;
    }
}
