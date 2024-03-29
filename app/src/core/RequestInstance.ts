import axios, { AxiosInstance, CancelTokenSource } from 'axios';
const { Proxy } = require('./Proxy');

const CancelToken = axios.CancelToken;
export class RequestInstance {
    private source: CancelTokenSource;
    public axios: AxiosInstance;

    constructor(baseURL: string | undefined, params?: any, headers?: any, proxy?: any) {
        this.source = CancelToken.source();
        this.axios = axios.create({
            baseURL: baseURL,
            params: params,
            headers: headers,
            httpsAgent: proxy ? proxy.getAgent() : undefined,
            cancelToken: this.source.token,
        });
    }

    public cancel(): void {
        this.source.cancel('This bitch got canceled');
        //Get another source token
        this.source = CancelToken.source();
        this.axios.defaults.cancelToken = this.source.token;
    }

    public updateProxy(proxyData: any) {
        console.log('updateing proxy with', proxyData);
        if (!proxyData) {
            this.axios.defaults.httpsAgent = undefined;
        } else {
            const newProxy = new Proxy(proxyData.proxy, proxyData.credential);
            this.axios.defaults.httpsAgent = newProxy.getAgent();
        }
    }

    get proxy(): any {
        return this.axios.defaults.httpsAgent;
    }
}
