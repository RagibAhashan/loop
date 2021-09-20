import { COMMON_HEADERS } from './../core/constants/Constants';

export enum StoreType {
    FootlockerUS = 'FootlockerUS',
    FootlockerCA = 'FootlockerCA',
    WalmartUS = 'WalmartUS',
    WalmartCA = 'WalmartCA',
}

export enum CaptchaType {
    Google,
    Px,
}

export interface StoreInfo {
    name: string;
    baseURL: string;
    key: StoreType;
    headers: any;
    url: string;
    siteKey: string;
    captchaType: CaptchaType;
}

export type StoresMap = { readonly [key in StoreType]: StoreInfo };

export const STORES: StoresMap = {
    FootlockerUS: {
        name: 'Footlocker US',
        baseURL: 'https://www.footlocker.com/api',
        key: StoreType.FootlockerUS,
        headers: COMMON_HEADERS,
        url: 'https://www.footlocker.com',
        siteKey: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX',
        captchaType: CaptchaType.Google,
    },
    FootlockerCA: {
        name: 'Footlocker CA',
        baseURL: 'http://localhost:3200/api',
        key: StoreType.FootlockerCA,
        headers: COMMON_HEADERS,
        url: 'https://www.footlocker.ca',
        siteKey: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX', //captcha key,
        captchaType: CaptchaType.Google,
    },
    WalmartUS: {
        name: 'Walmart US',
        baseURL: 'https://www.walmart.com',
        key: StoreType.WalmartUS,
        headers: COMMON_HEADERS,
        url: 'https://www.walmart.com',
        siteKey: '',
        captchaType: CaptchaType.Px,
    },
    WalmartCA: {
        name: 'Walmart CA',
        baseURL: 'https://walmart.ca',
        key: StoreType.WalmartCA,
        headers: COMMON_HEADERS,
        url: 'https://www.walmart.com',
        siteKey: '',
        captchaType: CaptchaType.Px,
    },
};
