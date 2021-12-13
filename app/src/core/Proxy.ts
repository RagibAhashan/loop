import { HttpsProxyAgent } from 'https-proxy-agent';

export interface IProxy {
    hostname: string;
    port: string;
    user: string;
    password: string;
    host: string;
    proxySetName: string;
}
export class Proxy implements IProxy {
    hostname: string;
    port: string;
    user: string;
    password: string;
    host: string;
    proxySetName: string;
    httpsAgent: HttpsProxyAgent;

    constructor(hostname: string, port: string, proxySetName: string, user?: string, password?: string) {
        this.hostname = hostname;
        this.port = port;
        this.user = user;
        this.password = password;
        this.proxySetName = proxySetName;
        this.host = `${this.hostname}:${this.port}`;

        let auth = undefined;
        if (this.user && this.password) {
            auth = `${this.user}:${this.password}`;
        }

        this.httpsAgent = new HttpsProxyAgent({ hostname: this.hostname, port: this.port, auth: auth });
    }

    // Returns a simple data format for the view
    public getValue(): IProxy {
        return {
            hostname: this.hostname,
            password: this.password,
            user: this.user,
            port: this.port,
            host: this.host,
            proxySetName: this.proxySetName,
        };
    }

    public getAgent(): HttpsProxyAgent {
        return this.httpsAgent;
    }

    public testProxy(): boolean {
        throw Error('Method not implemented');
    }
}
