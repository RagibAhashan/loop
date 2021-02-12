const { HttpsProxyAgent } = require('https-proxy-agent');

class Proxy {
    constructor(proxyString, credentials = undefined) {
        this.proxy = proxyString;
        console.log('proxy', proxyString);
        console.log('cred', credentials);
        this.httpsAgent = new HttpsProxyAgent({ hostname: this.hostname, port: this.port, auth: credentials });
    }

    getAgent() {
        return this.httpsAgent;
    }

    get port() {
        return this.proxy.split(':')[1];
    }

    get hostname() {
        return this.proxy.split(':')[0];
    }
}

module.exports = { Proxy };
