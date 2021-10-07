import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { ThunkAction } from 'redux-thunk';
import { debug } from '../../core/Log';
import { AppState } from '../../global-store/GlobalStore';
import { Proxy, ProxyState } from '../../interfaces/OtherInterfaces';
import { StoreType } from './../../constants/Stores';
import { ProxySet } from './../../interfaces/OtherInterfaces';

const log = debug.extend('ProxyService');
export interface ProxyPayload {
    name: string;
}

export interface AddProxiesPayload extends ProxyPayload {
    proxies: Proxy[];
}

export interface DeleteIndividualProxyPayload extends ProxyPayload {
    proxyHost: string;
}

export interface AssignProxyPayload extends ProxyPayload {
    storeKey: StoreType;
    // hosts: { [host: string]: string[] };
    proxiesToTask: { taskUUID: string; proxy: Proxy | null }[];
    newNotUsedProxy: { [proxyHost: string]: Proxy };
}

export interface UnassignProxyPayload extends ProxyPayload {
    proxy: Proxy;
    taskID: string;
}

const initialState = {} as ProxyState;

export const proxySlice = createSlice({
    name: 'proxies',
    initialState: initialState,
    reducers: {
        createProxySet: (state, action: PayloadAction<ProxyPayload>) => {
            state[action.payload.name] = { proxies: {}, notUsed: {} };
        },
        deleteProxySet: (state, action: PayloadAction<ProxyPayload>) => {
            delete state[action.payload.name];
        },
        addProxiesToSet: (state, action: PayloadAction<AddProxiesPayload>) => {
            action.payload.proxies.forEach((proxy) => {
                state[action.payload.name].proxies[proxy.host] = proxy;
                state[action.payload.name].notUsed[proxy.host] = proxy;
            });
        },
        deleteProxyFromSet: (state, action: PayloadAction<DeleteIndividualProxyPayload>) => {
            deleteProxy(state, action, 'proxies');
            deleteProxy(state, action, 'notUsed');
        },

        deleteAllProxiesFromSet: (state, action: PayloadAction<ProxyPayload>) => {
            state[action.payload.name].proxies = {};
            state[action.payload.name].notUsed = {};
        },
        assignProxy: (state, action: PayloadAction<AssignProxyPayload>) => {
            state[action.payload.name].notUsed = action.payload.newNotUsedProxy;
        },
        unassignProxy: (state, action: PayloadAction<UnassignProxyPayload>) => {
            if (!action.payload.proxy) return;

            const index = state[action.payload.name].proxies[action.payload.proxy.host].usedBy.indexOf(action.payload.taskID);
            if (index > -1) {
                state[action.payload.name].proxies[action.payload.proxy.host].usedBy.splice(index, 1);
            }

            if (state[action.payload.name].proxies[action.payload.proxy.host].usedBy.length === 0) {
                state[action.payload.name].notUsed[action.payload.proxy.host] = action.payload.proxy;
            }
        },
    },
});

// SELECTORS
export const getProxySetByName = (state: AppState, proxyName: string): ProxySet => state.proxies[proxyName];
export const getProxySets = (state: AppState): ProxyState => state.proxies;

// ACTIONS
export const { createProxySet, deleteProxySet, addProxiesToSet, deleteProxyFromSet, deleteAllProxiesFromSet, assignProxy, unassignProxy } =
    proxySlice.actions;

// Utility functions
const deleteProxy = (state: ProxyState, action: PayloadAction<DeleteIndividualProxyPayload>, property: 'proxies' | 'notUsed') => {
    delete state[action.payload.name][property][action.payload.proxyHost];
};

// Assign proxy thunk, this thunk will choose a random proxy from state and call assignProxy dispatch to update used and notUsed arrays

// TODO change this logic to be immutable, i.e instead of modifying the actual notUsedProxy, copy it and then update it
export const assignRandomProxy =
    (proxySetName: string, storeKey: StoreType, taskIDs: string[]): ThunkAction<void, AppState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        const currProxySet = getState().proxies[proxySetName];
        console.log('Current proxy set : %O', currProxySet);
        // const notUsedLen = Object.keys(currProxySet.notUsed).length;
        // const N = notUsedLen > 0 ? notUsedLen : Object.values(currProxySet.proxies).length;
        // const tempProxyList = notUsedLen > 0 ? Object.values(currProxySet.notUsed) : Object.values(currProxySet.proxies);

        const notUsedProxies = cloneDeep(currProxySet.notUsed);

        const proxiesToTask = new Array<{ taskUUID: string; proxy: Proxy | null }>();
        // const hosts: { [host: string]: string[] } = {};
        for (let i = 0; i < taskIDs.length; i++) {
            // const proxyIndex = i % N;
            let randomProxy: Proxy = undefined;

            // take first proxy in notused proxy
            for (const key in notUsedProxies) {
                randomProxy = notUsedProxies[key];
                delete notUsedProxies[key];
                proxiesToTask.push({ proxy: randomProxy, taskUUID: taskIDs[i] });
                break;
            }

            // const randomProxy = tempProxyList[proxyIndex];

            // if (randomProxy) {

            // if (!hosts[randomProxy.host]) hosts[randomProxy.host] = [];
            // hosts[randomProxy.host].push(taskIDs[i]);
            // }
        }

        dispatch(
            assignProxy({
                name: proxySetName,
                proxiesToTask: proxiesToTask,
                storeKey: storeKey,
                newNotUsedProxy: notUsedProxies,
            }),
        );
    };

// DEFAULT EXPORT
export default proxySlice.reducer;
