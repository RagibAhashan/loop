export interface tempProxy {
    proxy: string;
    testStatus: string;
    usedBy: string[];
}

export interface Proxies {
    [proxyName: string]: tempProxy[];
}

export interface Proxy {
    proxy: string;
    credential: string;
    testStatus: string;
    usedBy: [];
}
