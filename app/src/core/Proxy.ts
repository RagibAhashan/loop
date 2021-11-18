import { HttpsProxyAgent } from 'https-proxy-agent';

export interface IProxy {
    hostname: string;
    port: string;
    user: string;
    password: string;
    httpsAgent: HttpsProxyAgent;
}
export class Proxy implements IProxy {
    hostname: string;
    port: string;
    user: string;
    password: string;
    host: string;
    httpsAgent: HttpsProxyAgent;

    constructor(hostname: string, port: string, user?: string, password?: string) {
        this.hostname = hostname;
        this.port = port;
        this.user = user;
        this.password = password;
        this.host = `${this.hostname}:${this.port}`;

        let auth = undefined;
        if (this.user && this.password) {
            auth = `${this.user}:${this.password}`;
        }

        this.httpsAgent = new HttpsProxyAgent({ hostname: this.hostname, port: this.port, auth: auth });
    }

    getAgent(): HttpsProxyAgent {
        return this.httpsAgent;
    }

    public testProxy(): boolean {
        throw Error('Method not implemented');
    }
}
