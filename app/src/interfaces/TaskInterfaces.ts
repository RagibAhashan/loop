import { Moment } from 'moment';
import { Proxy } from './OtherInterfaces';
export interface CreditCard {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
}

export interface Billing {
    lastName: string;
    email: string;
    phone: string;
    country: string;
    firstName: string;
    address: string;
    postalCode: string;
    /** Region is the full name the state for USA or the province for Canada */
    region: string;
    /** Town is synonym for city */
    town: string;
}
export interface UserProfile {
    payment: CreditCard;
    billing: Billing;
    shipping: Billing;
    same: boolean;
    name: string;
}

// TODO move this interface somewhere else
export interface WalmartCreditCard {
    integrityCheck: string;
    number: string;
    cvc: string;
    keyId: string;
    expiryMonth: string;
    expiryYear: string;
    phase: string;
}

export type StatusLevel = 'error' | 'status' | 'info' | 'idle' | 'cancel' | 'success' | 'fail';
export interface Status {
    message: string;
    level: StatusLevel;
    checkedSize?: string;
}

// Interfaces that define different captcha provider properties
// Subject to change
export interface PxCaptcha {
    redirectUrl: string;
    appId: string;
    jsClientSrc: string;
    firstPartyEnabled: boolean;
    vid: string;
    uuid: string;
    hostUrl: string;
    blockScript: string;
}

export interface GoogleCaptcha {
    siteKey: string;
}

// Used with the NOTIFY_CAPTCHA task event
export interface Captcha {
    taskUUID: string;
    params: PxCaptcha | GoogleCaptcha;
}

export interface TaskMap {
    [key: string]: TaskData; //a task have its uuid as key
}
export interface TaskData {
    uuid: string;
    running: boolean;
    status: Status;
    proxySet: string | null;
    profileName: string;
    retryDelay: number;
}

export interface FLTaskData extends TaskData {
    productSKU: string;
    deviceId: string | null;
    startDate?: Moment;
    startTime?: Moment;
    sizes: string[];
    manualTime?: boolean;
}

export interface WalmartTaskData extends TaskData {
    productSKU: string;
    offerId: string;
}

export interface StartTaskData {
    profileData: UserProfile;
    proxyData: Proxy | undefined;
    sizes: string[];
    retryDelay: number;
    productSKU: string;
}
