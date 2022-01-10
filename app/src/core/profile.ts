import { CreditCard, CreditCardFormData } from './credit-card';
import { CreditCardFactory } from './credit-card-factory';
import { EntityId } from './entity-id';
import { Viewable } from './viewable';

export const profilePrefix = 'prof';

export interface ProfileFormData {
    id: string;
    name: string; // identifier for profile
    billing: UserProfile;
    shipping: UserProfile;
    payment: CreditCardFormData;
}

export interface UserProfile {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    country: string;
    address: string;
    postalCode: string;
    /* Region is the full name the state for USA or the province for Canada */
    region: string;
    /* Town is synonym for city */
    town: string;
}

/* interface used as a mediator from client to backend */
export interface ProfileViewData {
    id: string;
    name: string;
    billing: UserProfile;
    shipping: UserProfile;
    payment: CreditCard;
    groupId: string;
}

export interface IProfile {
    id: string;
    name: string; // identifier for profile
    groupId: string;
    billing: UserProfile;
    shipping: UserProfile;
    payment: CreditCard;
    taskId: EntityId | null;
}

export class Profile implements IProfile, Viewable<ProfileViewData> {
    id: string;
    name: string;
    billing: UserProfile;
    shipping: UserProfile;
    payment: CreditCard;
    groupId: string;
    taskId: EntityId | null;

    private creditCardFactory;

    constructor(
        id: string,
        name: string,
        groupId: string,
        billing: UserProfile,
        shipping: UserProfile,
        payment: CreditCard,
        creditCardFactory: CreditCardFactory,
    ) {
        this.id = id;
        this.name = name;
        this.billing = billing;
        this.shipping = shipping;
        this.payment = payment;
        this.groupId = groupId;
        this.creditCardFactory = creditCardFactory;
        this.taskId = null;
    }

    public getViewData(): ProfileViewData {
        return {
            id: this.id,
            shipping: this.shipping,
            billing: this.billing,
            payment: this.payment,
            name: this.name,
            groupId: this.groupId,
        };
    }

    /* Stores profile without full cc informatino */
    public getValueDB(): Partial<Profile> {
        return {
            id: this.id,
            billing: this.billing,
            shipping: this.shipping,
            payment: this.payment.getValueDB() as CreditCard,
            name: this.name,
            groupId: this.groupId,
        };
    }

    public setTaskId(value: EntityId | null): void {
        this.taskId = value;
    }

    public editProfileName(name: string) {
        this.name = name;
    }

    public editShipping(shipUpdate: Partial<UserProfile>) {
        this.shipping = { ...this.shipping, ...shipUpdate };
    }

    public editBilling(billUpdate: Partial<UserProfile>) {
        this.billing = { ...this.billing, ...billUpdate };
    }

    public editPayment(newPayment: CreditCardFormData) {
        this.payment = this.creditCardFactory.createCreditCard(newPayment);
    }
}
