import { debug } from './log';
import { ProxyGroup } from './proxy-group';

const log = debug.extend('ProxyGroupFactory');

export class ProxyGroupFactory {
    public createProxyGroup(id: string, name: string): ProxyGroup {
        const proxySet = new ProxyGroup(id, name);
        return proxySet;
    }
}
