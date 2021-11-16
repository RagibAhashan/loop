export interface CreditCard {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
}

export interface UserProfile {
    lastName: string;
    email: string;
    phone: string;
    country: string;
    firstName: string;
    address: string;
    postalCode: string;
    /* Region is the full name the state for USA or the province for Canada */
    region: string;
    /* Town is synonym for city */
    town: string;
}
export interface ProfileData {
    payment: CreditCard;
    billing: UserProfile;
    shipping: UserProfile;
}

export interface IProfile {
    profileName: string; // identifier for profile
    profileData: ProfileData;
}

export class Profile implements IProfile {
    profileName: string;
    profileData: ProfileData;

    constructor(profileName: string, profileData: ProfileData) {
        this.profileName = profileName;
        this.profileData = profileData;
    }

    editProfileName(name: string) {
        this.profileName = name;
    }

    editShipping(key: string, value: string) {
        this.profileData.shipping[key] = value;
    }

    editBilling(key: string, value: string) {
        this.profileData.billing[key] = value;
    }
}
