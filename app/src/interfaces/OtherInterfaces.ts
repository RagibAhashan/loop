export interface tempProxy {
    proxy: string;
    testStatus: string;
    usedBy: string[];
}

export interface Proxies {
    [proxyName: string]: tempProxy[];
}

export interface Store {
    FootlockerCA: string;
    FootlockerUS: string
}

export interface Proxy {
    proxy: string;
    credential: string;
    testStatus: Store;
    usedBy: [];
}
