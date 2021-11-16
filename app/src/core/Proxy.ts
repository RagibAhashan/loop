import { HttpsProxyAgent } from 'https-proxy-agent';

export class Proxy {
    host: string; // hostname:port
    credentials: string; // user:pass
    private httpsAgent: HttpsProxyAgent;
    constructor(host: string, credentials?: string) {
        this.host = host;
        this.credentials = credentials;
        this.httpsAgent = new HttpsProxyAgent({ hostname: this.hostname, port: this.port, auth: credentials });
    }

    getAgent(): HttpsProxyAgent {
        return this.httpsAgent;
    }

    get port(): string {
        return this.host.split(':')[1];
    }

    get hostname(): string {
        return this.host.split(':')[0];
    }
}
