import { AxiosResponse } from 'axios';
import { NOTIFY_CAPTCHA, NOTIFY_CAPTCHA_SOLVED, TASK_STATUS, TASK_SUCCESS } from '../../common/Constants';
import { Cookie, Headers } from '../constants/Cookies';
import { ERRORS_CART, ERRORS_CHECKOUT, ERRORS_PAYMENT, ERRORS_SHIPPING, STATUS_ERROR } from '../constants/FootLocker';
import { CANCEL_ERROR, Task } from '../Task';
import { CreditCard, UserProfile } from './../../interfaces/TaskInterfaces';
import { MESSAGES } from './../constants/Constants';
import { FLCInfoForm, FLCOrderForm } from './../interface/FootLockerCA';
import { RequestInstance } from './../RequestInstance';

export class FootLockerTask extends Task {
    retryDelay: number;
    captchaSolved: boolean;
    waitingRoom: { refresh: boolean; delay: number };
    constructor(
        uuid: string,
        productSKU: string,
        sizes: string[],
        deviceId: string,
        requestInstance: RequestInstance,
        userProfile: UserProfile,
        retryDelay: number,
    ) {
        super(uuid, productSKU, sizes, deviceId, requestInstance, userProfile);
        this.retryDelay = retryDelay;
        this.captchaSolved = false;
        this.waitingRoom = { refresh: false, delay: 0 };
    }

    async getSessionTokens(): Promise<void> {
        let retry = false;
        this.waitingRoom = { refresh: false, delay: 0 };
        let headers = undefined;
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { status: MESSAGES.SESSION_INFO_MESSAGE, level: 'info' });

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue for session');
                    await this.emitStatus(MESSAGES.SESSION_QUEUE_MESSAGE, 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue for session');
                }

                const response = await this.axiosSession.get('/v4/session', { headers: headers });
                console.log('GOT SESSION ! ', response.headers);

                this.waitingRoom.refresh = false;
                const cookies = response.headers['set-cookie'].join();

                this.cookieJar.setFromRaw(cookies, Cookie.JSESSIONID);

                // get the new waiting room cookie after getting session passed queue
                this.cookieJar.setFromRaw(cookies, Cookie.WAITING_ROOM);

                console.log('cookie jar session', this.cookieJar);

                const csrf = response.data['data']['csrfToken'];
                this.cookieJar.set(Cookie.CSRF, csrf);
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    // console.log('SESSION ERROR ', response.headers);
                    // If we get a queue page
                    if (this.waitingRoom.refresh) {
                        // do nothing
                        console.log('refreshing');
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue');
                        headers = { cookie: this.dispatchQueue(response) };
                    } else if (response.data['url']) {
                        await this.dispatchCaptcha(response);
                    } else {
                        console.log('SESSION ERROR', response.statusText, response.status);
                        await this.handleStatusError(response.status, MESSAGES.SESSION_ERROR_MESSAGE);
                    }
                } else if (error.request) {
                    console.log('SESSION OTHER ERROR without response', error.request);
                    await this.emitStatus(MESSAGES.SESSION_ERROR_MESSAGE, 'error');
                    this.waitingRoom = { refresh: false, delay: 0 };
                } else {
                    console.log('SESSION OTHER ERROR', error);
                    await this.emitStatus(MESSAGES.SESSION_ERROR_MESSAGE, 'error');
                    this.waitingRoom = { refresh: false, delay: 0 };
                }
                retry = true;
            }
        } while (retry);
    }

    async getProductCode() {
        let retry = true;
        this.waitingRoom = { refresh: false, delay: 0 };
        let headers = undefined;
        do {
            try {
                this.cancelTask();
                this.emit(TASK_STATUS, { status: MESSAGES.CHECKING_SIZE_INFO_MESSAGE, level: 'info' });

                headers = {
                    cookie: this.cookieJar.getCookie(Cookie.JSESSIONID),
                    'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
                };

                if (this.cookieJar.has(Cookie.WAITING_ROOM)) {
                    headers.cookie += this.cookieJar.getCookie(Cookie.WAITING_ROOM);
                }

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue for checkout');
                    await this.emitStatus(MESSAGES.CHECKING_SIZE_INFO_MESSAGE + ' (In Queue)', 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue for checkout');
                }

                console.log('checkout header', headers);

                const response = await this.axiosSession.get(`/products/pdp/${this.productSKU}`, { headers: headers });
                console.log('PASSED CHECKOUT QUEUE !');
                const sellableUnits = response.data['sellableUnits'];
                const variantAttributes = response.data['variantAttributes'];
                if (!sellableUnits || !variantAttributes) {
                    await this.emitStatus(MESSAGES.CHECKING_SIZE_ERROR_MESSAGE, 'error');
                    continue;
                }
                const { code: styleCode } = variantAttributes.find((attr: any) => attr.sku === this.productSKU);

                const inStockUnits = sellableUnits.filter(
                    (unit: any) =>
                        unit.stockLevelStatus === 'inStock' && unit.attributes.some((attr: any) => attr.id === styleCode && attr.type === 'style'),
                );

                const size = this.sizes[Math.floor(Math.random() * this.sizes.length)];
                this.currentSize = size;
                for (const unit of inStockUnits) {
                    for (const attr of unit.attributes) {
                        if (attr.type === 'size') {
                            const currSize = parseFloat(attr.value);
                            if (currSize && currSize === parseFloat(size)) {
                                return attr.id;
                            } else if (attr.value === size) {
                                return attr.id;
                            }
                        }
                    }
                }
                await this.emitStatus(MESSAGES.CHECKING_SIZE_RETRY_MESSAGE, 'error');
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    console.log('CHECKOUT ERROR ', response.headers);

                    const notAvai = response.data.errors ? ERRORS_CHECKOUT[response.data.errors[0].code] : undefined;

                    if (this.waitingRoom.refresh) {
                        // do nothing
                        console.log('refreshing for checkout', this.cookieJar.getCookie(Cookie.WAITING_ROOM));
                    } else if (notAvai) {
                        console.log('checking stock error response not available', response.data);
                        await this.emitStatus(notAvai + ', retrying', 'error');
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue for checkout');
                        headers = { cookie: this.dispatchQueue(response) };
                    } else {
                        await this.handleStatusError(response.status, MESSAGES.CHECKING_SIZE_ERROR_MESSAGE);
                    }
                } else if (error.request) {
                    console.log('checking stock without response', error.request);
                    // here means server did not respond, so lets just not log anything an keep saying checking stock
                    await this.emitStatus(MESSAGES.CHECKING_SIZE_ERROR_MESSAGE, 'error');
                } else {
                    console.log('chceking other error', error);
                    await this.emitStatus(MESSAGES.CHECKING_SIZE_ERROR_MESSAGE, 'error');
                }
                retry = true;
            }
        } while (retry);
    }
    async addToCart() {
        let retry = false;
        let headers: any = {};
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emit(TASK_STATUS, {
                    status: MESSAGES.ADD_CART_INFO_MESSAGE + ` (${this.currentSize})`,
                    level: 'info',
                    checkedSize: this.currentSize,
                });
                headers = {
                    cookie: this.cookieJar.getCookie(Cookie.JSESSIONID),
                    'x-fl-productid': this.productCode,
                    'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
                };

                if (this.cookieJar.has(Cookie.DATADOME)) {
                    headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
                }

                if (this.cookieJar.has(Cookie.WAITING_ROOM)) {
                    headers.cookie += this.cookieJar.getCookie(Cookie.WAITING_ROOM);
                    console.log('add to cart setting waiting room cookie', headers);
                }

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue');
                    await this.emitStatus(MESSAGES.ADD_CART_INFO_MESSAGE + ' (In Queue)', 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue');
                }

                const body = { productQuantity: 1, productId: this.productCode };

                const response = await this.axiosSession.post('/users/carts/current/entries', body, { headers: headers });

                const cookies = response.headers['set-cookie'].join();
                this.cookieJar.setFromRaw(cookies, Cookie.CART_GUID);
                this.cookieJar.setFromRaw(cookies, Cookie.DATADOME);
            } catch (err) {
                this.cancelTask();
                const response = err.response;
                if (response) {
                    const oosError = response.data.errors ? ERRORS_CART[response.data.errors[0].type] : undefined;
                    if (oosError) {
                        await this.emitStatus(MESSAGES.CHECKING_SIZE_RETRY_MESSAGE, 'error');
                        this.productCode = await this.getProductCode();
                    } else if (response.data['url']) {
                        await this.dispatchCaptcha(response);
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue');
                        headers.cookie += this.dispatchQueue(response);
                    } else {
                        console.log(response.statusText, response.data);
                        await this.handleStatusError(response.status, MESSAGES.ADD_CART_ERROR_MESSAGE);
                    }
                } else if (err.request) {
                    console.log('ADDING TO CARD error withtou response here', err);
                    await this.emitStatus(MESSAGES.ADD_CART_ERROR_MESSAGE, 'error');
                } else {
                    console.log('ADDING TO CART OTHER ERROR ', err);
                    await this.emitStatus(MESSAGES.ADD_CART_ERROR_MESSAGE, 'error');
                }

                retry = true;
            }
        } while (retry);
    }
    async setBilling() {
        let retry = false;
        let headers: any = {};
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { status: MESSAGES.BILLING_INFO_MESSAGE, level: 'info' });

                headers = this.setHeaders();

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue');
                    await this.emitStatus(MESSAGES.BILLING_INFO_MESSAGE + ' (In Queue)', 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue');
                }

                await this.axiosSession.put(`/users/carts/current/email/${this.userProfile.shipping.email}`, undefined, { headers: headers });

                const userShipping = { shippingAddress: this.getInfoForm(true) };
                await this.axiosSession.post('/users/carts/current/addresses/shipping', userShipping, { headers: headers });

                const userBilling = this.getInfoForm(false);
                await this.axiosSession.post('/users/carts/current/set-billing', userBilling, { headers: headers });
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    console.log('BILLING ERRORS WITH RESPONSE', error);
                    const dataError = response.data.errors;
                    if (dataError && ERRORS_SHIPPING[error.response.data.errors[0].code]) {
                        this.emit(TASK_STATUS, { status: ERRORS_SHIPPING[error.response.data.errors[0].code], level: 'cancel' });
                        this.cancelTask();
                    } else if (response.data['url']) {
                        await this.dispatchCaptcha(response);
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue');
                        headers.cookie += this.dispatchQueue(response);
                    } else {
                        await this.handleStatusError(response.status, MESSAGES.BILLING_ERROR_MESSAGE);
                    }
                } else if (error.request) {
                    console.log('BILLING OTHER WIHTOUT RESPONSE HERE ERROR', error);
                    await this.emitStatus(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
                } else {
                    console.log('BILLING OTHER ERROR', error);
                    await this.emitStatus(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
                }
                retry = true;
            }
        } while (retry);
    }

    async placeOrder() {
        let retry = false;
        let headers: any = {};
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { status: MESSAGES.PLACING_ORDER_INFO_MESSAGE, level: 'info' });

                headers = this.setHeaders();

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue');
                    await this.emitStatus(MESSAGES.PLACING_ORDER_INFO_MESSAGE + ' (In Queue)', 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue');
                }

                const body = this.getOrderForm(this.userProfile.payment);

                await this.axiosSession.post('/v2/users/orders', body, { headers: headers });

                this.emit(TASK_STATUS, { status: MESSAGES.CHECKOUT_SUCCESS_MESSAGE, level: 'success', checkedSize: this.currentSize });
                this.emit(TASK_SUCCESS);
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    const terminateError = response.data.errors ? ERRORS_PAYMENT[error.response.data.errors[0].code] : undefined;
                    if (terminateError) {
                        this.emit(TASK_STATUS, { status: terminateError, level: 'cancel' });
                        throw new Error(CANCEL_ERROR);
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue');
                        headers.cookie += this.dispatchQueue(response);
                    } else {
                        await this.handleStatusError(response.status, MESSAGES.CHECKOUT_FAILED_MESSAGE);
                    }
                } else if (error.request) {
                    console.log('OTHER PLACE ORDER without response HERE', error);
                    await this.emitStatus(MESSAGES.CHECKOUT_FAILED_MESSAGE, 'error');
                } else {
                    console.log('OTHER PLACE ORDER ERROR HERE', error);
                    await this.emitStatus(MESSAGES.CHECKOUT_FAILED_MESSAGE, 'error');
                }

                retry = true;
            }
        } while (retry);
    }

    getInfoForm(shipping: boolean): FLCInfoForm {
        const user = shipping ? this.userProfile.shipping : this.userProfile.billing;
        return new FLCInfoForm(
            user.lastName,
            user.email,
            user.phone,
            user.country,
            user.firstName,
            user.address,
            user.postalCode,
            user.region,
            user.town,
        );
    }

    setHeaders(): any {
        const headers = {
            cookie: this.cookieJar.getCookie(Cookie.JSESSIONID, Cookie.CART_GUID, Cookie.DATADOME),
            'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
        };

        if (this.cookieJar.has(Cookie.WAITING_ROOM)) {
            headers.cookie += this.cookieJar.getCookie(Cookie.WAITING_ROOM);
            console.log('billing setting waiting room cookie', headers);
        }

        return headers;
    }

    getOrderForm(encCC: CreditCard): FLCOrderForm {
        return new FLCOrderForm(encCC.number, encCC.expiryMonth, encCC.expiryYear, encCC.cvc, this.deviceId);
    }

    cancelTask(): void {
        if (this.cancel) throw new Error(CANCEL_ERROR);
    }

    async emitStatus(message: string, level: string, delay?: number): Promise<any> {
        this.emit(TASK_STATUS, { status: message, level: level });
        const wait = this.waitError(delay ? delay : this.retryDelay);
        this.cancelTimeout = wait.cancel;
        // this is is promise not a function
        return wait.promise;
    }

    // This func will return one promise that will act as a sleep for the error message
    // and a cancel sleep so we dont wait the whole retry delay when we cancel our task during an error
    waitError(customDelay?: number): { promise: any; cancel: any } {
        let timeout: any, promise, cancel;

        promise = new Promise((resolve, reject) => {
            timeout = setTimeout(() => {
                resolve('Wait on error done');
            }, customDelay);

            cancel = () => {
                this.cancelTimeout = () => {};
                clearTimeout(timeout);
                reject(CANCEL_ERROR);
            };
        });

        return {
            promise: promise,
            cancel: cancel,
        };
    }

    async dispatchCaptcha(response: AxiosResponse): Promise<void> {
        this.emit(TASK_STATUS, { status: MESSAGES.WAIT_CAPTCHA_MESSAGE, level: 'captcha', checkedSize: this.currentSize });

        const cookies = response.headers['set-cookie'].join();
        const capDatadome = this.cookieJar.extract(cookies, Cookie.DATADOME);
        const captcha_url = `${response.data['url']}&cid=${capDatadome}`;

        this.emit(NOTIFY_CAPTCHA, {
            uuid: this.uuid,
            params: this.cookieJar.extractQueryParams(captcha_url),
        });

        const waitCap = this.waitForCaptcha();
        this.cancelTimeout = waitCap.cancel;

        const rawDatadome = await waitCap.promise;

        this.cookieJar.setFromRaw(rawDatadome, Cookie.DATADOME);
    }

    dispatchQueue(response: AxiosResponse) {
        const cookies = response.headers[Headers.SetCookie].join();
        const refreshHeader = response.headers[Headers.Refresh];
        this.cookieJar.setFromRaw(cookies, Cookie.WAITING_ROOM);

        this.waitingRoom = { refresh: true, delay: this.cookieJar.extractRefresh(refreshHeader) };
        console.log('trying again with quue', this.waitingRoom.delay);

        return this.cookieJar.getCookie(Cookie.WAITING_ROOM);
    }

    waitForCaptcha(): { promise: any; cancel: any } {
        let promise, cancel;

        promise = new Promise((resolve, reject) => {
            this.once(NOTIFY_CAPTCHA_SOLVED, (datadome) => {
                resolve(datadome);
            });

            cancel = () => {
                this.cancelTimeout = () => {};
                reject(CANCEL_ERROR);
            };
        });

        return { promise: promise, cancel: cancel };
    }

    async handleStatusError(status: string, message: string): Promise<void> {
        const err = STATUS_ERROR[status];
        if (err) {
            await this.emitStatus(message + err, 'error');
        } else {
            console.log('OTHER STATUS ERROR ,', status);
            await this.emitStatus(message + ` (${status})`, 'error');
        }
    }
}
