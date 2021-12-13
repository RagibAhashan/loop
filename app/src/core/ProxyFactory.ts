import { Proxy } from './Proxy';

export class ProxyFactory {
    /**
     *
     * @param proxy hostname:port:user:pass
     * @returns Proxy
     */
    public static createProxy(proxyStr: string, proxySetName: string): Proxy {
        // TODO Validate that shit
        const proxySplit = proxyStr.split(':');
        const hostname = proxySplit[0];
        const port = proxySplit[1];
        const user = proxySplit[2];
        const pass = proxySplit[3];

        const proxy = new Proxy(hostname, port, proxySetName, user, pass);

        return proxy;
    }
}
