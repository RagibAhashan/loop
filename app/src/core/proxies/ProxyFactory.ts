import { STORES } from '../../common/Constants';
import { Proxy } from './../Proxy';
import { RequestInstance } from './../RequestInstance';
import { ProxyTest } from './ProxyTest';

export class ProxyFactory {
    public static createProxyTest(setName: string, proxy: string, credential: string, storeName: string): ProxyTest {
        const store = STORES[storeName];

        const axios = new RequestInstance(undefined, proxy ? new Proxy(proxy, credential) : undefined);

        const proxyTest = new ProxyTest(axios, setName, proxy, store);

        return proxyTest;
    }
}
