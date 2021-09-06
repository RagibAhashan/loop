import { HttpsProxyAgent } from 'https-proxy-agent';

export class ProxyAgent {
    private proxy: string;
    private httpsAgent: HttpsProxyAgent;
    constructor(proxyString: string, credentials?: string) {
        this.proxy = proxyString;
        this.httpsAgent = new HttpsProxyAgent({ hostname: this.hostname, port: this.port, auth: credentials });
    }

    getAgent(): HttpsProxyAgent {
        return this.httpsAgent;
    }

    get port(): string {
        return this.proxy.split(':')[1];
    }

    get hostname(): string {
        return this.proxy.split(':')[0];
    }
}
