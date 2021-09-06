import { WalmartEncryption } from '../../services/Encryption/WalmartEncryption';
import { MESSAGES } from '../constants/Constants';
import { HTMLParser } from '../HTMLParser';
import { Task } from '../Task';
import { TASK_STATUS } from './../../common/Constants';
import { COUNTRY, REGIONS } from './../../common/Regions';
import { WalmartTaskData } from './../../interfaces/TaskInterfaces';
import {
    WALMART_US_ATC_HEADERS,
    WALMART_US_CHECKOUT_CART_HEADERS,
    WALMART_US_CHECKOUT_HEADERS,
    WALMART_US_CONFIRM_PAYMENT_HEADERS,
    WALMART_US_CREDIT_CARD_HEADERS,
    WALMART_US_PRODUCT_PAGE_HEADERS,
    WALMART_US_SHIPPING_HEADERS,
} from './../constants/Walmart';
import { CookieJar } from './../CookieJar';
import { WalmartCreditCard } from './../interface/UserProfile';
import { RequestInstance } from './../RequestInstance';

export class WalmartUSTask extends Task {
    private htmlParser: HTMLParser;
    protected taskData: WalmartTaskData;
    protected parsedURL!: URL;

    private static readonly WALMART_SELLER_ID = 'F55CDC31AB754BB68FE0B39041159D63';
    private static readonly WALMART_CATALOG_SELLER_ID = '0';
    private static readonly WALMART_SELLER_DISPLAY_NAME = 'Walmart.com';

    constructor(uuid: string, requestInstance: RequestInstance, taskData: WalmartTaskData) {
        super(uuid, requestInstance, taskData);
        this.taskData = taskData;
        this.htmlParser = new HTMLParser();
        this.parsedURL = new URL(this.taskData.productURL);
    }

    private isSoldByWalmart(product: any): boolean {
        let catalog = false,
            displayName = false,
            seller = false;

        if (typeof product['catalogSellerId'] === 'string') catalog = product['catalogSellerId'] === WalmartUSTask.WALMART_CATALOG_SELLER_ID;

        if (typeof product['catalogSellerId'] === 'number') catalog = product['catalogSellerId'] === +WalmartUSTask.WALMART_CATALOG_SELLER_ID;

        seller = product['sellerId'] === WalmartUSTask.WALMART_SELLER_ID;

        displayName = product['sellerDisplayName'].toLowerCase() === WalmartUSTask.WALMART_SELLER_DISPLAY_NAME.toLowerCase();

        return catalog || displayName || seller;
    }

    async doTask(): Promise<void> {
        try {
            this.cookieJar = new CookieJar(this.requestInstance.baseURL);

            const offerId = await this.getSession();

            await this.addToCart(offerId);

            await this.setShipping();

            const encCard = await this.setCreditCard();

            await this.placeOrder(encCard);
        } catch (e) {
            console.log('doTask error', e);
            throw new Error();
        }
    }

    async getSession(): Promise<string> {
        let retry = false;
        let headers: any = { ...WALMART_US_PRODUCT_PAGE_HEADERS };
        let offerId = '';

        do {
            try {
                retry = false;
                this.cancelTask();
                this.emit(TASK_STATUS, {
                    message: MESSAGES.GETTING_PRODUCT_INFO_MESSAGE,
                    level: 'info',
                });

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                console.log('launching pupeteer');

                // const cookies = await page.cookies(this.parsedURL.toString());

                // http://walmart.com/ip/pname/pid -> /ip/pname/pid
                const productURL = this.parsedURL.pathname;
                const resp = await this.axiosSession.get(productURL, { headers: headers });
                console.log('WALMART RESP', resp.headers);
                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromString(resp.headers['set-cookie']);

                offerId = this.getOfferId(resp.data) as string;
                console.log('GOT OFFER ID IS', offerId);

                if (!offerId) {
                    retry = true;
                    await this.emitStatusWithDelay(MESSAGES.OOS_RETRY_MESSAGE, 'info');
                }
            } catch (err) {
                this.cancelTask();
                retry = true;
                await this.emitStatusWithDelay(MESSAGES.SESSION_ERROR_MESSAGE, 'error');
                console.log('GET SESSION ERROR', err);
            }
        } while (retry);

        return offerId;
    }

    getOfferId(html: string): string | undefined {
        try {
            this.htmlParser.loadHTML(html);
            const itemDesc = this.htmlParser.parseJSONById('item');

            const product = itemDesc['item']['product']['buyBox']['products'][0];

            if (!this.isSoldByWalmart(product)) return undefined;

            const offerId = product['offerId'] as string;
            return offerId;
        } catch (err) {
            console.log('GET OFFER ID ERROR', err);
            return undefined;
        }
    }

    async addToCart(offerId: string): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_ATC_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emit(TASK_STATUS, {
                    message: MESSAGES.ADD_CART_INFO_MESSAGE,
                    level: 'info',
                });

                const cookie = this.cookieJar.serializeSession();

                console.log('ATC COOKIES', cookie);
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    offerId: offerId,
                    quantity: 1,
                    location: {
                        postalCode: '94066',
                        city: 'San Bruno',
                        state: 'CA',
                        isZipLocated: false,
                    },
                    shipMethodDefaultRule: 'SHIP_RULE_1',
                    storeIds: [2648, 5434, 2031, 2280, 5426],
                };

                console.log('atc body', body);
                const resp = await this.axiosSession.post('/api/v3/cart/guest/:CID/items', body, { headers: headers });
                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromString(resp.headers['set-cookie']);

                await this.checkAddToCart();
            } catch (err) {
                this.cancelTask();
                if (err.response) {
                    console.log('ADD TO CART CAPTCHA ERROR', err.response.status, err.response.data);
                }
                await this.emitStatusWithDelay(MESSAGES.ADD_CART_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }

    async checkAddToCart(): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_CHECKOUT_CART_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    storeList: [] as any[],
                    postalCode: '94066',
                    city: 'San Bruno',
                    state: 'CA',
                    isZipLocated: false,
                    'crt:CRT': '',
                    'customerId:CID': '',
                    'customerType:type': '',
                    'affiliateInfo:com.wm.reflector': '',
                };

                const resp = await this.axiosSession.post('/api/checkout/v3/contract?page=CHECKOUT_VIEW', body, { headers: headers });
                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromString(resp.headers['set-cookie']);
            } catch (err) {
                console.log('ERROR CHECKOUT CART', err);
                throw new Error(err);
            }
        } while (retry);
    }

    async setShipping(): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_SHIPPING_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emit(TASK_STATUS, {
                    message: MESSAGES.BILLING_INFO_MESSAGE,
                    level: 'info',
                });

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    addressLineOne: this.taskData.profile.shipping.address,
                    city: this.taskData.profile.shipping.town,
                    firstName: this.taskData.profile.shipping.firstName,
                    lastName: this.taskData.profile.shipping.lastName,
                    phone: this.taskData.profile.shipping.phone,
                    email: this.taskData.profile.shipping.email,
                    marketingEmailPref: true,
                    postalCode: this.taskData.profile.shipping.postalCode,
                    state: REGIONS[this.taskData.profile.shipping.country][this.taskData.profile.shipping.region],
                    countryCode: COUNTRY[this.taskData.profile.shipping.country],
                    addressType: 'RESIDENTIAL',
                    changedFields: [] as any[],
                };

                const resp = await this.axiosSession.post('/api/checkout/v3/contract/:PCID/shipping-address', body, { headers: headers });

                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromString(resp.headers['set-cookie']);
            } catch (err) {
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }

    async setCreditCard(): Promise<WalmartCreditCard> {
        let retry = false;
        let headers: any = { ...WALMART_US_CREDIT_CARD_HEADERS };
        let encryptedCard = {} as WalmartCreditCard;
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emit(TASK_STATUS, {
                    message: MESSAGES.BILLING_INFO_MESSAGE,
                    level: 'info',
                });

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                encryptedCard = await this.encryptCard();

                const body = {
                    encryptedPan: encryptedCard.number,
                    encryptedCvv: encryptedCard.cvc,
                    integrityCheck: encryptedCard.integrityCheck,
                    keyId: encryptedCard.keyId,
                    phase: encryptedCard.phase,
                    state: REGIONS[this.taskData.profile.billing.country][this.taskData.profile.billing.region],
                    city: this.taskData.profile.billing.town,
                    addressType: 'RESIDENTIAL',
                    postalCode: this.taskData.profile.billing.postalCode,
                    addressLineOne: this.taskData.profile.billing.address,
                    addressLineTwo: '',
                    firstName: this.taskData.profile.billing.firstName,
                    lastName: this.taskData.profile.billing.lastName,
                    expiryMonth: encryptedCard.expiryMonth,
                    expiryYear: encryptedCard.expiryYear,
                    phone: this.taskData.profile.billing.phone,
                    cardType: 'VISA', // by default can be visa for everything i think
                    isGuest: true,
                };

                const resp = await this.axiosSession.post('/api/checkout-customer/:CID/credit-card', body, { headers: headers });
                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromString(resp.headers['set-cookie']);

                await this.checkPayment(encryptedCard, {
                    cardType: resp.data['cardType'],
                    paymentType: resp.data['paymentType'],
                    piHash: resp.data['piHash'],
                });
            } catch (err) {
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);

        return encryptedCard;
    }

    private async checkPayment(card: WalmartCreditCard, cardValidation: { piHash: string; cardType: string; paymentType: string }): Promise<void> {
        let headers: any = { ...WALMART_US_CONFIRM_PAYMENT_HEADERS };
        try {
            const cookie = this.cookieJar.serializeSession();
            if (cookie) headers = { ...headers, cookie: cookie };

            const body = {
                payments: [
                    {
                        paymentType: cardValidation.paymentType,
                        cardType: cardValidation.cardType,
                        firstName: this.taskData.profile.billing.firstName,
                        lastName: this.taskData.profile.billing.lastName,
                        addressLineOne: this.taskData.profile.billing.address,
                        addressLineTwo: '',
                        city: this.taskData.profile.billing.town,
                        state: REGIONS[this.taskData.profile.billing.country][this.taskData.profile.billing.region],
                        postalCode: this.taskData.profile.billing.postalCode,
                        expiryMonth: card.expiryMonth,
                        expiryYear: card.expiryYear,
                        email: this.taskData.profile.billing.email,
                        phone: this.taskData.profile.billing.phone,
                        encryptedPan: card.number,
                        encryptedCvv: card.cvc,
                        integrityCheck: card.integrityCheck,
                        keyId: card.keyId,
                        phase: card.phase,
                        piHash: cardValidation.piHash,
                    },
                ],
                cvvInSession: true,
            };

            const resp = await this.axiosSession.post('/api/checkout/v3/contract/:PCID/payment', body, { headers: headers });

            if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromString(resp.headers['set-cookie']);
        } catch (error) {
            console.log('CHECKING CREDIT CARD ERROR', error);
            throw new Error(error);
        }
    }

    async placeOrder(encCard: WalmartCreditCard): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_US_CHECKOUT_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emit(TASK_STATUS, {
                    message: MESSAGES.PLACING_ORDER_INFO_MESSAGE,
                    level: 'info',
                });

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    cvvInSession: true,
                    voltagePayments: [
                        {
                            paymentType: 'CREDITCARD',
                            encryptedCvv: encCard.cvc,
                            encryptedPan: encCard.number,
                            integrityCheck: encCard.integrityCheck,
                            keyId: encCard.keyId,
                            phase: encCard.phase,
                        },
                    ],
                };

                const resp = await this.axiosSession.put('/api/checkout/v3/contract/:PCID/order', body, { headers: headers });
                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromString(resp.headers['set-cookie']);
            } catch (err) {
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.CHECKOUT_FAILED_MESSAGE, 'error');
            }
        } while (retry);
    }

    private async encryptCard(): Promise<WalmartCreditCard> {
        const ccEncryptor = new WalmartEncryption();

        const encCard = await ccEncryptor.encrypt(this.taskData.profile.payment);

        return encCard;
    }
}
