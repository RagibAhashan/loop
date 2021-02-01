import { CreditCard } from './CreditCard';
export interface Billing {
    address: string;
    city: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    postalcode: string;
    province: string;
}
export interface Profile {
    payment: CreditCard;
    billing: Billing;
    shipping: Billing;
    same: boolean;
    profile: string;
}

export interface TaskData {
    uuid: string;
    store?: string;
    productLink: string;
    proxyset: string;
    profile: string;
    quantity: number;
    retrydelay: number;
    startdate?: moment.Moment;
    starttime?: moment.Moment;
    sizes: string[];
    manualtime: boolean;
    monitordelay?: number;
}
