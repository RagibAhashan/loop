import { FOOTLOCKER_CA_HEADERS, FOOTLOCKER_COM_HEADERS } from './../core/constants/Constants';
import { WALMART_HEADERS } from './../core/constants/Walmart';

export enum StoreType {
    FootlockerUS = 'FootlockerUS',
    FootlockerCA = 'FootlockerCA',
    WalmartUS = 'WalmartUS',
    WalmartCA = 'WalmartCA',
}

export interface StoreInfo {
    name: string;
    baseURL: string;
    key: StoreType;
    headers: any;
    url: string;
    siteKey: string;
}

export type StoresMap = { readonly [key in StoreType]: StoreInfo };

export const STORES: StoresMap = {
    FootlockerUS: {
        name: 'Footlocker US',
        baseURL: 'https://www.footlocker.com/api',
        key: StoreType.FootlockerUS,
        headers: FOOTLOCKER_COM_HEADERS,
        url: 'https://www.footlocker.com',
        siteKey: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX',
    },
    FootlockerCA: {
        name: 'Footlocker CA',
        baseURL: 'http://localhost:3200/api',
        key: StoreType.FootlockerCA,
        headers: FOOTLOCKER_CA_HEADERS,
        url: 'https://www.footlocker.ca',
        siteKey: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX', //captcha key
    },
    WalmartUS: {
        name: 'Walmart US',
        baseURL: 'https://www.walmart.com',
        key: StoreType.WalmartUS,
        headers: WALMART_HEADERS,
        url: 'https://www.walmart.com',
        siteKey: '6Lc8-RIaAAAAAPWSm2FVTyBg-Zkz2UjsWWfrkgYN',
    },
    WalmartCA: {
        name: 'Walmart CA',
        baseURL: 'https://www.walmart.ca',
        key: StoreType.WalmartCA,
        headers: WALMART_HEADERS,
        url: 'https://www.walmart.com',
        siteKey: '6LdC-hIaAAAAALLCgO92mcNONQ-7MGIxmJd82kw5',
    },
};
