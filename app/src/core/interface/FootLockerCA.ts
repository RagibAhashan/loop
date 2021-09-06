import { COUNTRY, REGIONS } from '../../common/Regions';
import { Country, Region } from './UserProfile';

export class FLCInfoForm {
    setAsDefaultBilling: boolean;
    setAsDefaultShipping: boolean;
    billingAddress: boolean;
    defaultAddress: boolean;
    id: null;
    lastName: string;
    email: string;
    phone: string;
    country: Country;
    firstName: string;
    line1: string;
    postalCode: string;
    region: Region;
    setAsBilling: boolean;
    shippingAddress: boolean;
    town: string;
    visibleInAddressBook: boolean;
    type: string;
    LoqateSearch: string;
    constructor(
        lastName: string,
        email: string,
        phone: string,
        country: string,
        firstName: string,
        line1: string,
        postalCode: string,
        region: string,
        town: string,
    ) {
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.country = { isocode: COUNTRY[country], name: country };
        this.firstName = firstName;
        this.line1 = line1;
        this.postalCode = postalCode;
        this.region = {
            name: region,
            countryIso: COUNTRY[country],
            isocode: REGIONS[country][region].isocode,
            isocodeShort: REGIONS[country][region].isocodeShort,
        };
        this.setAsDefaultBilling = false;
        this.setAsDefaultShipping = false;
        this.billingAddress = false;
        this.defaultAddress = false;
        this.id = null;
        this.setAsBilling = false;
        this.shippingAddress = false;
        this.town = town;
        this.visibleInAddressBook = false;
        this.type = 'default';
        this.LoqateSearch = '';
    }
}

export class FLCOrderForm {
    encryptedCardNumber: string;
    encryptedExpiryMonth: string;
    encryptedExpiryYear: string;
    encryptedSecurityCode: string;
    deviceId: string;
    preferredLanguage: string;
    termsAndCondition: boolean;
    paymentMethod: string;
    returnUrl: string;
    browserInfo: any;
    constructor(encCardNum: string, encMonth: string, encYear: string, encCVC: string, deviceId: string) {
        this.encryptedCardNumber = encCardNum;
        this.encryptedExpiryMonth = encMonth;
        this.encryptedExpiryYear = encYear;
        this.encryptedSecurityCode = encCVC;
        this.deviceId = deviceId;
        this.preferredLanguage = 'en';
        this.termsAndCondition = false;
        this.paymentMethod = 'CREDITCARD';
        this.returnUrl = 'https://www.footlocker.ca/adyen/checkout';
        this.browserInfo = {
            screenWidth: 1920,
            screenHeight: 1080,
            colorDepth: 24,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.3=',
            timeZoneOffset: 300,
            language: 'en-CA',
            javaEnabled: false,
        };
    }
}
