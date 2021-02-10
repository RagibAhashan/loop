const { COUNTRY, REGIONS } = require('../../common/Regions');

class FLCInfoForm {
    constructor(
        lastName,
        email,
        phone,
        country,
        firstName,
        line1,
        postalCode,
        region,
        town,
        setAsDefaultBilling = false,
        setAsDefaultShipping = false,
        billingAddress = false,
        defaultAddress = false,
        id = null,
        shippingAddress = false,
        setAsBilling = false,
        visibleInAddressBook = false,
        type = 'default',
        LoqateSearch = '',
    ) {
        this.setAsDefaultBilling = setAsDefaultBilling;
        this.setAsDefaultShipping = setAsDefaultShipping;
        this.billingAddress = billingAddress;
        this.defaultAddress = defaultAddress;
        this.id = id;
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
        this.setAsBilling = setAsBilling;
        this.shippingAddress = shippingAddress;
        this.town = town;
        this.visibleInAddressBook = visibleInAddressBook;
        this.type = type;
        this.LoqateSearch = LoqateSearch;
    }
}

class FLCOrderForm {
    constructor(
        encCardNum,
        encMonth,
        encYear,
        encCVC,
        deviceId,
        prefLang = 'en',
        terms = false,
        paymentMethod = 'CREDITCARD',
        returnUrl = 'https://www.footlocker.ca/adyen/checkout',
        browserInfo = {
            screenWidth: 1920,
            screenHeight: 1080,
            colorDepth: 24,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.3=',
            timeZoneOffset: 300,
            language: 'en-CA',
            javaEnabled: false,
        },
    ) {
        this.encryptedCardNumber = encCardNum;
        this.encryptedExpiryMonth = encMonth;
        this.encryptedExpiryYear = encYear;
        this.encryptedSecurityCode = encCVC;
        this.deviceId = deviceId;
        this.preferredLanguage = prefLang;
        this.termsAndCondition = terms;
        this.paymentMethod = paymentMethod;
        this.returnUrl = returnUrl;
        this.browserInfo = browserInfo;
    }
}

module.exports = { FLCInfoForm, FLCOrderForm };
