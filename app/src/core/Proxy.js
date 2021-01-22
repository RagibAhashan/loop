const { HttpsProxyAgent } = require('https-proxy-agent');

class Proxy {
    constructor(host, port) {
        this.host = host;
        this.port = port;

        this.httpsAgent = new HttpsProxyAgent(`http://${this.host}:${this.port}`);
    }

    getAgent() {
        return this.httpsAgent;
    }
}

module.exports = { Proxy };
