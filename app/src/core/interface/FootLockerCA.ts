import { Country, Region } from './UserProfile';
export interface InfoForm {
  setAsDefaultBilling: boolean;
  setAsDefaultShipping: boolean;
  lastName: string;
  email: string;
  phone: string;
  country: Country;
  firstName: string;
  billingAddress: boolean;
  defaultAddress: boolean;
  id: null;
  line1: string;
  postalCode: string;
  region: Region;
  setAsBilling: boolean;
  shippingAddress: boolean;
  town: string;
  visibleInAddressBook: boolean;
  type: string;
  LoqateSearch: string;
}

export class FLCInfoForm implements InfoForm {
  setAsDefaultBilling: boolean;
  setAsDefaultShipping: boolean;
  lastName: string;
  email: string;
  phone: string;
  country: Country;
  firstName: string;
  billingAddress: boolean;
  defaultAddress: boolean;
  id: null;
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
    country: Country,
    firstName: string,
    line1: string,
    postalCode: string,
    region: Region,
    town: string,
    setAsDefaultBilling = false,
    setAsDefaultShipping = false,
    billingAddress = false,
    defaultAddress = false,
    id = null,
    shippingAddress = false,
    setAsBilling = false,
    visibleInAddressBook = false,
    type = 'default',
    LoqateSearch = ''
  ) {
    this.setAsDefaultBilling = setAsDefaultBilling;
    this.setAsDefaultShipping = setAsDefaultShipping;
    this.billingAddress = billingAddress;
    this.defaultAddress = defaultAddress;
    this.id = id;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.country = country;
    this.firstName = firstName;
    this.line1 = line1;
    this.postalCode = postalCode;
    this.region = region;
    this.setAsBilling = setAsBilling;
    this.shippingAddress = shippingAddress;
    this.town = town;
    this.visibleInAddressBook = visibleInAddressBook;
    this.type = type;
    this.LoqateSearch = LoqateSearch;
  }
}

export interface OrderForm {
  preferredLanguage: string;
  termsAndCondition: boolean;
  deviceId: string;
  encryptedCardNumber: string;
  encryptedExpiryMonth: string;
  encryptedExpiryYear: string;
  encryptedSecurityCode: string;
  paymentMethod: string;
  returnUrl: string;
  browserInfo: BrowserInfo;
}

export interface BrowserInfo {
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  userAgent: string;
  timeZoneOffset: number;
  language: string;
  javaEnabled: boolean;
}

export class FLCOrderForm implements OrderForm {
  preferredLanguage: string;
  termsAndCondition: boolean;
  deviceId: string;
  encryptedCardNumber: string;
  encryptedExpiryMonth: string;
  encryptedExpiryYear: string;
  encryptedSecurityCode: string;
  paymentMethod: string;
  returnUrl: string;
  browserInfo: BrowserInfo;
  constructor(
    encCardNum: string,
    encMonth: string,
    encYear: string,
    encCVC: string,
    deviceId: string,
    prefLang = 'en',
    terms = false,
    paymentMethod = 'CREDITCARD',
    returnUrl = 'https://www.footlocker.ca/adyen/checkout',
    browserInfo: BrowserInfo = {
      screenWidth: 1920,
      screenHeight: 1080,
      colorDepth: 24,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.3=',
      timeZoneOffset: 300,
      language: 'en-CA',
      javaEnabled: false,
    }
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
