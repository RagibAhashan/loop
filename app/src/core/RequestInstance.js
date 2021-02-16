const axios = require('axios').default;
const { Proxy } = require('./Proxy');

const CancelToken = axios.CancelToken;
class RequestInstance {
    constructor(baseURL, params = undefined, headers = undefined, proxy = undefined) {
        this.source = CancelToken.source();
        this.axios = axios.create({
            baseURL: baseURL,
            params: params,
            headers: headers,
            httpsAgent: proxy ? proxy.getAgent() : undefined,
            cancelToken: this.source.token,
        });
    }

    cancel() {
        this.source.cancel('This bitch got canceled');
        //Get another source token
        this.source = CancelToken.source();
        this.axios.defaults.cancelToken = this.source.token;
    }

    updateProxy(proxyData) {
        console.log('updateing proxy with', proxyData);
        if (!proxyData) {
            this.axios.defaults.httpsAgent = undefined;
        } else {
            const newProxy = new Proxy(proxyData.proxy, proxyData.credential);
            this.axios.defaults.httpsAgent = newProxy.getAgent();
        }
    }

    get proxy() {
        return this.axios.defaults.httpsAgent;
    }
}

module.exports = { RequestInstance };
