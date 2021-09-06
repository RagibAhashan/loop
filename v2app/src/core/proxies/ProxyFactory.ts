import { STORES } from '../../constants/Stores';
import { StoreType } from './../../constants/Stores';
import { ProxyAgent } from './../Proxy';
import { RequestInstance } from './../RequestInstance';
import { ProxyTest } from './ProxyTest';

export class ProxyFactory {
    public static createProxyTest(setName: string, proxy: string, credential: string, storeName: StoreType): ProxyTest {
        const store = STORES[storeName];

        const axios = new RequestInstance('', proxy ? new ProxyAgent(proxy, credential) : undefined);

        const proxyTest = new ProxyTest(axios, setName, proxy, store);

        return proxyTest;
    }
}
