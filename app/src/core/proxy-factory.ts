import { debug } from './log';
import { Proxy, ProxyFormData } from './proxy';

const log = debug.extend('ProxyFactory');

export class ProxyFactory {
    /**
     *
     * @param proxy hostname:port:user:pass
     * @returns Proxy
     */
    public createProxy(groupId: string, proxyData: ProxyFormData): Proxy {
        // TODO Validate that

        const proxySplit = proxyData.proxy.split(':');
        const hostname = proxySplit[0];
        const port = proxySplit[1];
        const user = proxySplit[2];
        const password = proxySplit[3];

        const proxy = new Proxy(proxyData.id, groupId, hostname, port, user, password);

        return proxy;
    }
}
