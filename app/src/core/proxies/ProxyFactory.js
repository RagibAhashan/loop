const { Proxy } = require('./Proxy');

class ProxyFactory {
    createProxyTest(setName, proxy, credential, store) {

        const { RequestInstance } = require('./RequestInstance');
        const { ProxyTest } = require('./ProxyTest');

        const axios = new RequestInstance(store.url, { timestamp: Date.now() }, store.header, proxy ? new Proxy(proxy, credential) : proxy);
        const proxyTest = new ProxyTest(setName, axios);

        return proxyTest.executeTest();
    }
}

module.exports = new ProxyFactory();
