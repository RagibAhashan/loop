export interface Proxies {
    [proxyName: string]: Proxy[];
}

export interface Stores {
    FootlockerCA: string;
    FootlockerUS: string;
}

export interface IStore {
    title: string;
    key: string;
}

export interface Proxy {
    proxy: string;
    credential: string;
    testStatus: Stores;
    usedBy: string[];
}
