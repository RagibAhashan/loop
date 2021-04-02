export interface UserProfile {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    postalCode: string;
    region: Region;
    town: string;
    country: Country;
    creditCard: CreditCard;
}

export interface Region {
    countryIso: string;
    isocode: string;
    isocodeShort: string;
    name: string;
}

export interface Country {
    isocode: string;
    name: string;
}

export interface CreditCard {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
}
