import axios, { AxiosInstance, CancelTokenSource } from 'axios';
import { Proxy } from './../interfaces/OtherInterfaces';
import { ProxyAgent } from './Proxy';

const CancelToken = axios.CancelToken;
export class RequestInstance {
    private source: CancelTokenSource;
    public axios: AxiosInstance;
    public baseURL: string;

    constructor(baseURL: string, params?: any, headers?: any, proxy?: any) {
        this.source = CancelToken.source();
        this.axios = axios.create({
            baseURL: baseURL === '' ? undefined : baseURL,
            params: params,
            headers: headers,
            httpsAgent: proxy ? proxy.getAgent() : undefined,
            cancelToken: this.source.token,
        });
        this.baseURL = baseURL;
    }

    public cancel(): void {
        this.source.cancel('This bitch got canceled');
        //Get another source token
        this.source = CancelToken.source();
        this.axios.defaults.cancelToken = this.source.token;
    }

    public updateProxy(proxyData: Proxy | null) {
        console.log('updateing proxy with', proxyData);
        if (!proxyData) {
            this.axios.defaults.httpsAgent = undefined;
        } else {
            const newProxy = new ProxyAgent(proxyData.host, proxyData.credential);
            this.axios.defaults.httpsAgent = newProxy.getAgent();
        }
    }

    get proxy(): any {
        return this.axios.defaults.httpsAgent;
    }
}
