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
    region: string;
    town: string;
}
export interface UserProfile {
    payment: CreditCard;
    billing: Billing;
    shipping: Billing;
    same: boolean;
    profile: string;
}

export interface TaskData {
    uuid: string;
    store?: string;
    productSKU: string;
    proxySet: string | undefined;
    profile: string;
    quantity?: number;
    retryDelay: number;
    startDate?: Moment;
    startTime?: Moment;
    sizes: string[];
    manualTime?: boolean;
    monitorDelay?: number;
    running?: boolean;
}

export interface StartTaskData {
    profileData: UserProfile;
    proxyData: Proxy | undefined;
    sizes: string[];
    retryDelay: number;
    productSKU: string;
}
