class UserProfile {
    constructor(email, firstName, lastName, address, phone, postalCode, region, town, country, creditCard) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.phone = phone;
        this.postalCode = postalCode;
        this.region = region;
        this.town = town;
        this.country = country;
        this.creditCard = creditCard;
    }
}

class Region {
    constructor(countryIso, isocode, isocodeShort, name) {
        this.countryIso = countryIso;
        this.isocode = isocode;
        this.isocodeShort = isocodeShort;
        this.name = name;
    }
}

class Country {
    constructor(isocode, name) {
        this.isocode = isocode;
        this.name = name;
    }
}

class CreditCard {
    constructor(number, expiryMonth, expiryYear, cvc) {
        this.number = number;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.cvc = cvc;
    }
}

module.exports = { CreditCard, Country, Region, UserProfile };
