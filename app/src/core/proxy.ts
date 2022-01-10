import { HttpsProxyAgent } from 'https-proxy-agent';
import { EntityId } from './entity-id';
import { Viewable } from './viewable';

export const proxyPrefix = 'prox';

export interface ProxyFormData {
    id: string;
    proxy: string; // Array of string containing proxies in this format : host:port:user:pass
}

export interface ProxyViewData {
    id: string;
    hostname: string;
    port: string;
    user: string;
    password: string;
    host: string;
}

export interface IProxy {
    id: string;
    hostname: string;
    port: string;
    user: string;
    password: string;
    host: string;
    proxySetId: string;
    taskId: EntityId | null;
}
export class Proxy implements IProxy, Viewable<ProxyViewData> {
    id: string;
    hostname: string;
    port: string;
    user: string;
    password: string;
    host: string;
    proxySetId: string;
    httpsAgent: HttpsProxyAgent;
    taskId: EntityId | null;

    constructor(id: string, proxySetId: string, hostname: string, port: string, user?: string, password?: string) {
        this.id = id;
        this.hostname = hostname;
        this.port = port;
        this.proxySetId = proxySetId;
        this.host = `${this.hostname}:${this.port}`;

        let auth;
        if (user && password) {
            this.user = user;
            this.password = password;
            auth = `${this.user}:${this.password}`;
        }

        this.httpsAgent = new HttpsProxyAgent({ hostname: this.hostname, port: this.port, auth: auth });
        this.taskId = null;
    }

    // Returns a simple data format for the view
    public getViewData(): ProxyViewData {
        return {
            id: this.id,
            hostname: this.hostname,
            password: this.password,
            user: this.user,
            port: this.port,
            host: this.host,
        };
    }

    public getAgent(): HttpsProxyAgent {
        return this.httpsAgent;
    }

    public setTaskId(value: EntityId | null): void {
        this.taskId = value;
    }

    public testProxy(): boolean {
        throw Error('Method not implemented');
    }
}
