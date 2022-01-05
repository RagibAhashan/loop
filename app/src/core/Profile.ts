import { CreditCard, CreditCardFormData } from './CreditCard';
import { CreditCardFactory } from './CreditCardFactory';
import { Viewable } from './Viewable';

export const profilePrefix = 'prof';

export interface ProfileFormData {
    id: string;
    profileName: string; // identifier for profile
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
    profileName: string;
    billing: UserProfile;
    shipping: UserProfile;
    payment: CreditCard;
    groupId: string;
}

export interface IProfile {
    id: string;
    profileName: string; // identifier for profile
    groupId: string;
    billing: UserProfile;
    shipping: UserProfile;
    payment: CreditCard;
}

export class Profile implements IProfile, Viewable<ProfileViewData> {
    id: string;
    profileName: string;
    billing: UserProfile;
    shipping: UserProfile;
    payment: CreditCard;
    groupId: string;

    private creditCardFactory;

    constructor(
        id: string,
        profileName: string,
        groupId: string,
        billing: UserProfile,
        shipping: UserProfile,
        payment: CreditCard,
        creditCardFactory: CreditCardFactory,
    ) {
        this.id = id;
        this.profileName = profileName;
        this.billing = billing;
        this.shipping = shipping;
        this.payment = payment;
        this.groupId = groupId;
        this.creditCardFactory = creditCardFactory;
    }

    public getViewData(): ProfileViewData {
        return {
            id: this.id,
            shipping: this.shipping,
            billing: this.billing,
            payment: this.payment,
            profileName: this.profileName,
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
            profileName: this.profileName,
            groupId: this.groupId,
        };
    }

    public editProfileName(name: string) {
        this.profileName = name;
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
