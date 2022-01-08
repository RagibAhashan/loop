export enum StoreType {
    FootlockerUS = 'FootlockerUS',
    FootlockerCA = 'FootlockerCA',
    WalmartUS = 'WalmartUS',
    WalmartCA = 'WalmartCA',
}

export enum AccountStoreType {
    WalmartUS = 'WalmartUS',
    WalmartCA = 'WalmartCA',
    Amazon = 'Amazon',
}

export interface AccountStoreInfo {
    name: string;
}

export enum CaptchaType {
    Google,
    Px,
}

export interface StoreInfo {
    name: string;
    baseURL: string;
    key: StoreType;
    url: string;
    siteKey: string;
    captchaType: CaptchaType;
}

export const STORES: Record<StoreType, StoreInfo> = {
    FootlockerUS: {
        name: 'Footlocker US',
        baseURL: 'https://www.footlocker.com/api',
        key: StoreType.FootlockerUS,
        url: 'https://www.footlocker.com',
        siteKey: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX',
        captchaType: CaptchaType.Google,
    },
    FootlockerCA: {
        name: 'Footlocker CA',
        baseURL: 'http://localhost:3200/api',
        key: StoreType.FootlockerCA,
        url: 'https://www.footlocker.ca',
        siteKey: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX', //captcha key,
        captchaType: CaptchaType.Google,
    },
    WalmartUS: {
        name: 'Walmart US',
        baseURL: 'https://www.walmart.com',
        key: StoreType.WalmartUS,
        url: 'https://www.walmart.com',
        siteKey: '',
        captchaType: CaptchaType.Px,
    },
    WalmartCA: {
        name: 'Walmart CA',
        baseURL: 'https://www.walmart.ca',
        key: StoreType.WalmartCA,
        url: 'https://www.walmart.ca',
        siteKey: '',
        captchaType: CaptchaType.Px,
    },
};

export const ACCOUNT_STORES: Record<AccountStoreType, AccountStoreInfo> = {
    Amazon: { name: 'Amazon' },
    WalmartCA: { name: 'Walmart CA' },
    WalmartUS: { name: 'Walmart US' },
};

export const getStores = () => {
    return Object.entries(STORES);
};

export const getAccountStores = () => {
    return Object.entries(ACCOUNT_STORES);
};
