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

export type StatusLevel = 'error' | 'status' | 'info' | 'idle' | 'cancel' | 'success';
export interface Status {
    message: string;
    level: StatusLevel;
    checkedSize?: string;
}

export interface TaskMap {
    [key: string]: TaskData; //a task have its uuid as key
}
export interface TaskData {
    uuid: string;
    running: boolean;
    status: Status;
    proxy: Proxy | null;
    proxySet: string | null;
    profile: UserProfile;
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
    productURL: string;
}

export interface StartTaskData {
    profileData: UserProfile;
    proxyData: Proxy | undefined;
    sizes: string[];
    retryDelay: number;
    productSKU: string;
}
