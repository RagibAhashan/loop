export interface Proxies {
    [proxyName: string]: Proxy[];
}

export interface Store {
    FootlockerCA: string;
    FootlockerUS: string;
}

export interface Proxy {
    proxy: string;
    credential: string;
    testStatus: Store;
    usedBy: string[];
}
