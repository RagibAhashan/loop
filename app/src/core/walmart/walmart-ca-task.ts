import { Account } from '@core/account';
import { Profile } from '@core/profile';
import { ProxyGroup } from '@core/proxy-group';
import { RequestInstance } from '@core/request-instance';
import { TaskEmittedEvents } from '@core/task';
import { COUNTRY, REGIONS } from '../../common/Regions';
import { WalmartCreditCard } from '../../interfaces/TaskInterfaces';
import { WalmartEncryption } from '../../services/encryption/walmart-encryption';
import { MESSAGES } from '../constants/Constants';
import {
    WALMART_CA_ADD_CART_HEADERS,
    WALMART_CA_CC_SUMMARY_HEADERS,
    WALMART_CA_CHECKOUT_GUEST_HEADERS,
    WALMART_CA_CREDIT_CARD_HEADERS,
    WALMART_CA_PLACE_ORDER_HEADERS,
    WALMART_CA_SESSION_HEADERS,
    WALMART_CA_SHIPPING_ADDRESS_HEADERS,
    WALMART_CA_SHIPPING_METHOD_HEADERS,
} from '../constants/Walmart';
import { CookieJar } from '../cookie-jar';
import { CaptchaException } from '../exceptions/CaptchaException';
import { debug } from '../log';
import { generatePxCookies } from './scripts/px';
import { WalmartTask } from './walmart-task';

const log = debug.extend('WalmartCATask');

export class WalmartCATask extends WalmartTask {
    constructor(
        id: string,
        retryDelay: number,
        productIdentifier: string,
        userProfile: Profile,
        proxySet: ProxyGroup | null,
        account: Account | null,
        productQuantity: number,
        taskGroupName: string,
        requestInstance: RequestInstance,
    ) {
        super(id, retryDelay, productIdentifier, userProfile, proxySet, account, productQuantity, taskGroupName, requestInstance);
    }

    async doTask(): Promise<void> {
        super.doTask();

        return;

        try {
            this.cookieJar = new CookieJar(this.requestInstance.baseURL);

            await this.getSession();

            await this.addToCart();

            await this.checkoutAsGuest();

            await this.setShippingAddress();

            await this.setShippingMethod();

            const [encCard, paymentId] = await this.setCreditCard();

            await this.placeOrder(encCard, paymentId);
        } catch (error) {
            log('doTask Error %o', error);
            throw new Error();
        }
    }

    async getSession(): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_CA_SESSION_HEADERS };

        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.GETTING_PRODUCT_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();

                if (cookie) {
                    headers = { ...headers, cookie: cookie };
                } else {
                    log('Executing PX script');
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    require('browser-env')({
                        // TODO : discrepancy with this user agent and the one used in the headers
                        userAgent: this.axiosSession.defaults.headers['user-agent'],
                    });

                    const cookies = await generatePxCookies();
                    log('Saving cookies generated by PX script');
                    await this.cookieJar.saveInSessionFromDocumentCookie(cookies);
                }

                const resp = await this.axiosSession.get('/en', { headers: headers });
                log('Getting session resp %O', resp.status);

                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }
            } catch (err) {
                log('Get Session Error');
                this.cancelTask();
                retry = true;
                await this.emitStatusWithDelay(MESSAGES.SESSION_ERROR_MESSAGE, 'error');
            }
        } while (retry);
    }

    async addToCart(): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_CA_ADD_CART_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.ADD_CART_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();

                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    postalCode: 'L5V2N6',
                    items: [
                        {
                            offerId: this.productIdentifier,
                            skuId: this.productIdentifier,
                            quantity: this.productQuantity,
                            allowSubstitutions: false,
                            subscription: false,
                            action: 'ADD',
                        },
                    ],
                    pricingStoreId: '1061',
                };

                const resp = await this.axiosSession.post('/api/product-page/cart?responseGroup=essential&storeId=1061&lang=en', body, {
                    headers: headers,
                });
                log('Add to Cart response %O', resp.statusText);
                if (resp.headers['set-cookie']) {
                    await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                }
            } catch (err) {
                log('Adding to cart error');
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.ADD_CART_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }

    async checkoutAsGuest(): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_CA_CHECKOUT_GUEST_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                log('Checking as guest');
                const resp = await this.axiosSession.put('/api/checkout-page/checkout-as-guest?lang=en', {}, { headers: headers });
                log('Checking as guest response %O', resp.statusText);
                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
            } catch (err) {
                log('Checking as guest Error');
                throw new Error(err);
            }
        } while (retry);
    }

    async setShippingAddress(): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_CA_SHIPPING_ADDRESS_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.BILLING_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    fulfillmentType: 'SHIPTOHOME',
                    deliveryInfo: {
                        firstName: this.userProfile.shipping.firstName,
                        lastName: this.userProfile.shipping.lastName,
                        addressLine1: this.userProfile.shipping.address,
                        addressLine2: '',
                        city: this.userProfile.shipping.town,
                        state: REGIONS[this.userProfile.shipping.country][this.userProfile.shipping.region].isocodeShort,
                        postalCode: this.userProfile.shipping.postalCode,
                        phone: this.userProfile.shipping.phone,
                        saveToProfile: true,
                        country: COUNTRY[this.userProfile.shipping.country],
                        locationId: null,
                        overrideAddressVerification: false,
                    },
                    email: this.userProfile.shipping.email,
                };

                log('Setting shipping address %O', body);
                const resp = await this.axiosSession.post('/api/checkout-page/checkout/address?lang=en&availStore=1061&slotBooked=false', body, {
                    headers: headers,
                });
                log('Set Shipping resp %O', resp.statusText);

                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
            } catch (err) {
                log('Set Shipping Address Failed');
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }

    async setShippingMethod(): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_CA_SHIPPING_METHOD_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.BILLING_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    shipMethods: [
                        {
                            offerId: this.productIdentifier,
                            levelOfService: 'STANDARD',
                        },
                    ],
                };

                log('Setting shipping and billing');
                const resp = await this.axiosSession.post(
                    '/api/checkout-page/checkout/items/ship-method?lang=en&availStore=1061&postalCode=L5V2N6',
                    body,
                    { headers: headers },
                );
                log('Set Shipping Method resp %O', resp.statusText);

                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
            } catch (err) {
                log('Set Shipping Method Failed');
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }

    private async setPaymentSummary(encryptedCard: WalmartCreditCard): Promise<string> {
        let headers: any = { ...WALMART_CA_CC_SUMMARY_HEADERS };

        const cookie = this.cookieJar.serializeSession();
        if (cookie) headers = { ...headers, cookie: cookie };

        const body = {
            orderTotal: 1,
            paymentMethods: [
                {
                    piHash: {
                        pan: encryptedCard.number,
                        cvv: encryptedCard.cvc,
                        encryption: {
                            integrityCheck: encryptedCard.integrityCheck,
                            phase: encryptedCard.phase,
                            keyId: encryptedCard.keyId,
                        },
                    },
                    cardType: 'CREDIT_CARD',
                    pmId: 'VISA',
                    cardLast4Digits: encryptedCard.number.substr(encryptedCard.number.length - 4),
                    referenceId: '79p7cs', // TODO seems that this field can be removed
                },
            ],
        };

        log('Setting Summary');
        const resp = await this.axiosSession.post('/api/checkout-page/payments/summary', body, { headers: headers });
        if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
        log('Setting Summary %O', resp.statusText);

        const piHash = resp.data['paymentMethods'][0]['piHash'];
        log('Got CC PiHash %s', piHash);
        return piHash;
    }

    async setCreditCard(): Promise<[WalmartCreditCard, string]> {
        let retry = false;
        let headers: any = { ...WALMART_CA_CREDIT_CARD_HEADERS };
        let encryptedCard = {} as WalmartCreditCard;
        let paymentId;
        encryptedCard = await this.encryptCard();

        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.BILLING_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const piHash = await this.setPaymentSummary(encryptedCard);

                const last_4_digits = encryptedCard.number.substr(encryptedCard.number.length - 4);

                const piBlob = {
                    payment_details: {
                        pi_hash: piHash,
                        pm_id: 'VISA',
                        card: {
                            last_4_digits: last_4_digits,
                            type: 'CREDIT_CARD',
                            exp_month: encryptedCard.expiryMonth,
                            exp_year: encryptedCard.expiryYear,
                        },
                        customer: {
                            address: {
                                address1: this.userProfile.billing.address,
                                city: this.userProfile.billing.town,
                                country_code: COUNTRY[this.userProfile.shipping.country],
                                postal_code: this.userProfile.billing.postalCode,
                                state_or_province_code: REGIONS[this.userProfile.shipping.country][this.userProfile.shipping.region].isocodeShort,
                            },
                            first_name: this.userProfile.billing.firstName,
                            last_name: this.userProfile.billing.lastName,
                            phone: this.userProfile.billing.phone,
                        },
                        save_to_profile: 'N',
                    },
                };

                const body = {
                    type: 'CREDIT_CARD',
                    cardType: 'VISA',
                    piBlob: JSON.stringify(piBlob),
                    cvvRequired: 'Y',
                };

                log('Setting Credit Card');
                const resp = await this.axiosSession.post('/api/checkout-page/checkout/payments?lang=en&availStoreId=1061&postalCode=L5V2N6', body, {
                    headers: headers,
                });

                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);

                paymentId = resp.data['paymentInfo'][0]['paymentId'];

                log('Setting cc resp %O', resp.statusText);
                log('Got payment id %s', paymentId);
            } catch (err) {
                log('Setting Credit Card Failed');
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE + ' SCC', 'error');
                retry = true;
            }
        } while (retry);

        return [encryptedCard, paymentId];
    }

    async placeOrder(encCard: WalmartCreditCard, paymentId: string): Promise<void> {
        let retry = false;
        let headers: any = { ...WALMART_CA_PLACE_ORDER_HEADERS };
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emitStatus(MESSAGES.PLACING_ORDER_INFO_MESSAGE, 'info');

                const cookie = this.cookieJar.serializeSession();
                if (cookie) headers = { ...headers, cookie: cookie };

                const body = {
                    cvv: [
                        {
                            credentialEncrypted: true,
                            paymentId: paymentId,
                            voltageCredential: {
                                cypherTextCvv: encCard.cvc,
                                cypherTextPan: encCard.number,
                                integrityCheck: encCard.integrityCheck,
                                keyId: encCard.keyId,
                                phase: parseInt(encCard.phase),
                            },
                        },
                    ],
                    ogInfo: {
                        // TODO check meaning of ogSessionId
                        ogSessionId: ' ',
                        ogAutoship: false,
                    },
                };
                log('Placing payment');
                const resp = await this.axiosSession.post(
                    '/api/checkout-page/checkout/place-order?lang=en&availStoreId=1061&postalCode=L5V2N6',
                    body,
                    { headers: headers },
                );
                if (resp.headers['set-cookie']) await this.cookieJar.saveInSessionFromArray(resp.headers['set-cookie']);
                log('Payment resp %O', resp.statusText);
            } catch (err) {
                log('Payment Failed');
                this.cancelTask();
                await this.emitStatusWithDelay(MESSAGES.CHECKOUT_FAILED_MESSAGE, 'error');
            }
        } while (retry);
    }

    private async encryptCard(): Promise<WalmartCreditCard> {
        const ccEncryptor = new WalmartEncryption();

        const encCard = await ccEncryptor.encrypt(this.userProfile.payment);

        return encCard;
    }

    /*
    This function will wait for the user to solve the captcha
    */
    private async dispatchCaptcha(captchaResponse: any): Promise<void> {
        this.emitStatus(MESSAGES.WAIT_CAPTCHA_MESSAGE, 'info');

        this.emit(TaskEmittedEvents.Captcha, {
            id: this.id,
            params: captchaResponse,
        });

        const waitCap = this.waitForCaptcha();
        this.cancelTimeout = waitCap.cancel;
        await waitCap.promise;
    }

    protected createErrorInterceptor(): void {
        this.axiosSession.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                if (error.response) {
                    log('Response Error %O', error.response);
                    // Captcha
                    if (error.response.status === 412) {
                        log('Dispatching Captcha');
                        await this.dispatchCaptcha(error.response.data);
                        return Promise.reject(new CaptchaException('Walmart US Captcha Exception', error.response));
                    }
                }
                return Promise.reject(error);
            },
        );
    }
}
