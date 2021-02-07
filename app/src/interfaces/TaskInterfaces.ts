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
    productLink: string;
    productSKU: string;
    proxySet: string | undefined;
    profile: string;
    quantity: number;
    retryDelay: number;
    startDate?: moment.Moment;
    startTime?: moment.Moment;
    sizes: string[];
    manualTime: boolean;
    monitorDelay?: number;
}
