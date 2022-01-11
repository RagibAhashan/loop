import { StoreType } from '../constants/stores';
export interface ProxyState {
    [proxyName: string]: ProxyGroup;
}

export interface Stores {
    FootlockerCA: string;
    FootlockerUS: string;
}

export interface IStore {
    title: string;
    key: StoreType;
}

export interface ProxyGroup {
    proxies: { [proxyHost: string]: Proxy };
    notUsed: { [proxyHost: string]: Proxy };
}
export interface Proxy {
    host: string; // ip:port
    credential: string; // user:pass
    testStatus: Stores;
    usedBy: string[];
}
