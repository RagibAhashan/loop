import { debug } from './log';
import { IProxy, Proxy } from './proxy';

const log = debug.extend('ProxyFactory');

export class ProxyFactory {
    /**
     *
     * @param proxy hostname:port:user:pass
     * @returns Proxy
     */
    public createProxy(proxyData: IProxy): Proxy {
        // TODO Validate that

        const proxy = new Proxy(proxyData.id, proxyData.groupId, proxyData.hostname, proxyData.port, proxyData.user, proxyData.password);

        return proxy;
    }
}
