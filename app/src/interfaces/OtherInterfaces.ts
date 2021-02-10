export interface Proxy {
    proxy: string;
    testStatus: string;
    usedBy: string[];
}

export interface Proxies {
    [proxyName: string]: Proxy[];
}
