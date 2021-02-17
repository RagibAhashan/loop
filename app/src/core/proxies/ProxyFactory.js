const { Proxy } = require('../Proxy');
const { STORES } = require('../../common/Constants');

class ProxyFactory {
    createProxyTest(setName, proxy, credential, storeName) {
        const store = STORES[storeName];

        const { RequestInstance } = require('../RequestInstance');
        const { ProxyTest } = require('./ProxyTest');

        const axios = new RequestInstance(
            undefined,
            proxy ? new Proxy(proxy, credential) : undefined
        );

        const proxyTest = new ProxyTest(axios, setName, proxy, store);

        return proxyTest;
    }
}

module.exports = new ProxyFactory();
