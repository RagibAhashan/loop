import { debug } from './log';
import { Proxy, ProxyFormData } from './proxy';

const log = debug.extend('ProxyFactory');

export class ProxyFactory {
    /**
     *
     * @param proxy hostname:port:user:pass
     * @returns Proxy
     */
    public static createProxy(proxySetId: string, proxyData: ProxyFormData): Proxy {
        // TODO Validate that

        const proxySplit = proxyData.proxy.split(':');
        const hostname = proxySplit[0];
        const port = proxySplit[1];
        const user = proxySplit[2];
        const pass = proxySplit[3];

        const proxy = new Proxy(proxyData.id, proxySetId, hostname, port, user, pass);

        return proxy;
    }
}
