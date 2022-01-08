import { StoreType } from '../constants/stores';
export interface ProxyState {
    [proxyName: string]: ProxySet;
}

export interface Stores {
    FootlockerCA: string;
    FootlockerUS: string;
}

export interface IStore {
    title: string;
    key: StoreType;
}

export interface ProxySet {
    proxies: { [proxyHost: string]: Proxy };
    notUsed: { [proxyHost: string]: Proxy };
}
export interface Proxy {
    host: string; // ip:port
    credential: string; // user:pass
    testStatus: Stores;
    usedBy: string[];
}
