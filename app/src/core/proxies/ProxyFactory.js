const { Proxy } = require('../Proxy');

class ProxyFactory {
    createProxyTest(setName, proxy, credential, store) {

        const { RequestInstance } = require('../RequestInstance');
        const { ProxyTest } = require('./ProxyTest');

        const axios = new RequestInstance(
            store.url, 
            { timestamp: Date.now() }, 
            store.header, 
            proxy ? new Proxy(proxy, credential) : undefined
        );
        console.log(new Proxy(proxy, credential));
        const proxyTest = new ProxyTest(setName, axios);

        return proxyTest.executeTest();
    }
}

module.exports = new ProxyFactory();
