import { AxiosResponse } from 'axios';
import { NOTIFY_CAPTCHA, NOTIFY_CAPTCHA_SOLVED, TASK_STATUS, TASK_SUCCESS } from '../../common/Constants';
import { Cookie, Headers } from '../constants/Cookies';
import { ERRORS_CART, ERRORS_CHECKOUT, ERRORS_PAYMENT, ERRORS_SHIPPING, STATUS_ERROR } from '../constants/FootLocker';
import { CANCEL_ERROR, Task } from '../Task';
import { CreditCard, FLTaskData } from './../../interfaces/TaskInterfaces';
import { MESSAGES } from './../constants/Constants';
import { CookieJar } from './../CookieJar';
import { FLCInfoForm, FLCOrderForm } from './../interface/FootLockerCA';
import { RequestInstance } from './../RequestInstance';

export class FootLockerTask extends Task {
    captchaSolved: boolean;
    waitingRoom: { refresh: boolean; delay: number };
    productCode: string;
    currentSize: string;

    constructor(uuid: string, requestInstance: RequestInstance, taskData: FLTaskData) {
        super(uuid, requestInstance, taskData);
        this.captchaSolved = false;
        this.waitingRoom = { refresh: false, delay: 0 };
        this.currentSize = '';
        this.productCode = '';
        this.taskData = this.taskData as FLTaskData;
    }

    async doTask(): Promise<void> {
        try {
            this.cookieJar = new CookieJar(this.requestInstance.baseURL);

            console.log('proxy used footlocker', this.requestInstance.proxy);

            await this.getSessionTokens();

            this.productCode = await this.getProductCode();

            await this.addToCart();

            await this.setBilling();

            await this.placeOrder();
        } catch (e) {
            throw new Error();
        }
    }
    async getSessionTokens(): Promise<void> {
        let retry = false;
        this.waitingRoom = { refresh: false, delay: 0 };
        let headers = undefined; // keep it undef here
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { message: MESSAGES.SESSION_INFO_MESSAGE, level: 'info' });

                if (this.waitingRoom.refresh) {
                    headers = { cookie: this.cookieJar.serializeSession() };
                    console.log('waiting queue for session');
                    await this.emitStatusWithDelay(MESSAGES.SESSION_QUEUE_MESSAGE, 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue for session');
                }

                const response = await this.axiosSession.get('/v4/session', { headers: headers });
                console.log('GOT SESSION ! ', response.headers);

                this.waitingRoom.refresh = false;
                const cookies = response.headers['set-cookie'];
                if (cookies) await this.cookieJar.saveInSessionFromString(cookies);

                // this.cookieJar.setFromRaw(cookies, Cookie.JSESSIONID);

                // get the new waiting room cookie after getting session passed queue
                // this.cookieJar.setFromRaw(cookies, Cookie.WAITING_ROOM);

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
                        this.dispatchQueue(response);
                    } else if (response.data['url']) {
                        await this.dispatchCaptcha(response);
                    } else {
                        console.log('SESSION ERROR', response.statusText, response.status);
                        await this.handleStatusError(response.status, MESSAGES.SESSION_ERROR_MESSAGE);
                    }
                } else if (error.request) {
                    console.log('SESSION OTHER ERROR without response', error.request);
                    await this.emitStatusWithDelay(MESSAGES.SESSION_ERROR_MESSAGE, 'error');
                    this.waitingRoom = { refresh: false, delay: 0 };
                } else {
                    console.log('SESSION OTHER ERROR', error);
                    await this.emitStatusWithDelay(MESSAGES.SESSION_ERROR_MESSAGE, 'error');
                    this.waitingRoom = { refresh: false, delay: 0 };
                }
                retry = true;
            }
        } while (retry);
    }

    async getProductCode(): Promise<string> {
        let retry = true;
        this.waitingRoom = { refresh: false, delay: 0 };
        let headers = undefined;
        do {
            try {
                this.cancelTask();
                this.emit(TASK_STATUS, { message: MESSAGES.CHECKING_STOCK_INFO_MESSAGE, level: 'info' });

                headers = {
                    cookie: this.cookieJar.serializeSession(),
                    'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
                };

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue for checkout');
                    await this.emitStatusWithDelay(MESSAGES.CHECKING_STOCK_INFO_MESSAGE + ' (In Queue)', 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue for checkout');
                }

                console.log('checkout header', headers);

                const response = await this.axiosSession.get(`/products/pdp/${(this.taskData as FLTaskData).productSKU}`, { headers: headers });

                const cookies = response.headers['set-cookie'];
                if (cookies) await this.cookieJar.saveInSessionFromString(cookies);

                console.log('PASSED CHECKOUT QUEUE !');
                const sellableUnits = response.data['sellableUnits'];
                const variantAttributes = response.data['variantAttributes'];
                if (!sellableUnits || !variantAttributes) {
                    await this.emitStatusWithDelay(MESSAGES.CHECKING_STOCK_ERROR_MESSAGE, 'error');
                    continue;
                }
                const { code: styleCode } = variantAttributes.find((attr: any) => attr.sku === (this.taskData as FLTaskData).productSKU);

                const inStockUnits = sellableUnits.filter(
                    (unit: any) =>
                        unit.stockLevelStatus === 'inStock' && unit.attributes.some((attr: any) => attr.id === styleCode && attr.type === 'style'),
                );

                const size = (this.taskData as FLTaskData).sizes[Math.floor(Math.random() * (this.taskData as FLTaskData).sizes.length)];
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
                await this.emitStatusWithDelay(MESSAGES.OOS_RETRY_MESSAGE, 'error');
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    console.log('CHECKOUT ERROR ', response.headers);

                    const notAvai = response.data.errors ? ERRORS_CHECKOUT[response.data.errors[0].code] : undefined;

                    if (this.waitingRoom.refresh) {
                        // do nothing
                        console.log('refreshing for checkout');
                    } else if (notAvai) {
                        console.log('checking stock error response not available', response.data);
                        await this.emitStatusWithDelay(notAvai + ', retrying', 'error');
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue for checkout');
                        this.dispatchQueue(response);
                    } else {
                        await this.handleStatusError(response.status, MESSAGES.CHECKING_STOCK_ERROR_MESSAGE);
                    }
                } else if (error.request) {
                    console.log('checking stock without response', error.request);
                    // here means server did not respond, so lets just not log anything an keep saying checking stock
                    await this.emitStatusWithDelay(MESSAGES.CHECKING_STOCK_ERROR_MESSAGE, 'error');
                } else {
                    console.log('chceking other error', error);
                    await this.emitStatusWithDelay(MESSAGES.CHECKING_STOCK_ERROR_MESSAGE, 'error');
                }
                retry = true;
            }
        } while (retry);
    }
    async addToCart(): Promise<void> {
        let retry = false;
        let headers: any = {};
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emit(TASK_STATUS, {
                    message: MESSAGES.ADD_CART_INFO_MESSAGE + ` (${this.currentSize})`,
                    level: 'info',
                    checkedSize: this.currentSize,
                });

                headers = {
                    cookie: this.cookieJar.serializeSession(),
                    'x-fl-productid': this.productCode,
                    'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
                };

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue');
                    await this.emitStatusWithDelay(MESSAGES.ADD_CART_INFO_MESSAGE + ' (In Queue)', 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue');
                }

                const body = { productQuantity: 1, productId: this.productCode };

                const response = await this.axiosSession.post('/users/carts/current/entries', body, { headers: headers });
                const cookies = response.headers['set-cookie'];
                if (cookies) await this.cookieJar.saveInSessionFromString(cookies);
            } catch (err) {
                this.cancelTask();
                const response = err.response;
                if (response) {
                    const oosError = response.data.errors ? ERRORS_CART[response.data.errors[0].type] : undefined;
                    if (oosError) {
                        await this.emitStatusWithDelay(MESSAGES.OOS_RETRY_MESSAGE, 'error');
                        this.productCode = await this.getProductCode();
                    } else if (response.data['url']) {
                        await this.dispatchCaptcha(response);
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue');
                        this.dispatchQueue(response);
                    } else {
                        console.log(response.statusText, response.data);
                        await this.handleStatusError(response.status, MESSAGES.ADD_CART_ERROR_MESSAGE);
                    }
                } else if (err.request) {
                    console.log('ADDING TO CARD error withtou response here', err);
                    await this.emitStatusWithDelay(MESSAGES.ADD_CART_ERROR_MESSAGE, 'error');
                } else {
                    console.log('ADDING TO CART OTHER ERROR ', err);
                    await this.emitStatusWithDelay(MESSAGES.ADD_CART_ERROR_MESSAGE, 'error');
                }

                retry = true;
            }
        } while (retry);
    }
    async setBilling(): Promise<void> {
        let retry = false;
        let headers: any = {};

        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { message: MESSAGES.BILLING_INFO_MESSAGE, level: 'info' });

                headers = this.setHeaders();

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue');
                    await this.emitStatusWithDelay(MESSAGES.BILLING_INFO_MESSAGE + ' (In Queue)', 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue');
                }

                let res = undefined;

                res = await this.axiosSession.put(`/users/carts/current/email/${this.taskData.profile.shipping.email}`, undefined, {
                    headers: headers,
                });

                let cookies = res.headers['set-cookie'];
                if (cookies) await this.cookieJar.saveInSessionFromString(cookies);

                const userShipping = { shippingAddress: this.getInfoForm(true) };
                res = await this.axiosSession.post('/users/carts/current/addresses/shipping', userShipping, { headers: headers });

                cookies = res.headers['set-cookie'];
                if (cookies) await this.cookieJar.saveInSessionFromString(cookies);

                const userBilling = this.getInfoForm(false);
                res = await this.axiosSession.post('/users/carts/current/set-billing', userBilling, { headers: headers });

                cookies = res.headers['set-cookie'];
                if (cookies) await this.cookieJar.saveInSessionFromString(cookies);
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    console.log('BILLING ERRORS WITH RESPONSE', error);
                    const dataError = response.data.errors;
                    if (dataError && ERRORS_SHIPPING[error.response.data.errors[0].code]) {
                        this.emit(TASK_STATUS, { message: ERRORS_SHIPPING[error.response.data.errors[0].code], level: 'cancel' });
                        this.cancelTask();
                    } else if (response.data['url']) {
                        await this.dispatchCaptcha(response);
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue');
                        this.dispatchQueue(response);
                    } else {
                        await this.handleStatusError(response.status, MESSAGES.BILLING_ERROR_MESSAGE);
                    }
                } else if (error.request) {
                    console.log('BILLING OTHER WIHTOUT RESPONSE HERE ERROR', error);
                    await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
                } else {
                    console.log('BILLING OTHER ERROR', error);
                    await this.emitStatusWithDelay(MESSAGES.BILLING_ERROR_MESSAGE, 'error');
                }
                retry = true;
            }
        } while (retry);
    }

    async placeOrder(): Promise<void> {
        let retry = false;
        let headers: any = {};
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { message: MESSAGES.PLACING_ORDER_INFO_MESSAGE, level: 'info' });

                headers = this.setHeaders();

                if (this.waitingRoom.refresh) {
                    console.log('waiting queue');
                    await this.emitStatusWithDelay(MESSAGES.PLACING_ORDER_INFO_MESSAGE + ' (In Queue)', 'info', this.waitingRoom.delay);
                    console.log('finish waiting refresh queue');
                }

                const body = this.getOrderForm(this.taskData.profile.payment);

                await this.axiosSession.post('/v2/users/orders', body, { headers: headers });

                this.emit(TASK_STATUS, { message: MESSAGES.CHECKOUT_SUCCESS_MESSAGE, level: 'success', checkedSize: this.currentSize });
                this.emit(TASK_SUCCESS);
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    const terminateError = response.data.errors ? ERRORS_PAYMENT[error.response.data.errors[0].code] : undefined;
                    if (terminateError) {
                        this.emit(TASK_STATUS, { message: terminateError, level: 'cancel' });
                        throw new Error(CANCEL_ERROR);
                    } else if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        console.log('got hit with queue');
                        this.dispatchQueue(response);
                    } else {
                        await this.handleStatusError(response.status, MESSAGES.CHECKOUT_FAILED_MESSAGE);
                    }
                } else if (error.request) {
                    console.log('OTHER PLACE ORDER without response HERE', error);
                    await this.emitStatusWithDelay(MESSAGES.CHECKOUT_FAILED_MESSAGE, 'error');
                } else {
                    console.log('OTHER PLACE ORDER ERROR HERE', error);
                    await this.emitStatusWithDelay(MESSAGES.CHECKOUT_FAILED_MESSAGE, 'error');
                }

                retry = true;
            }
        } while (retry);
    }

    getInfoForm(shipping: boolean): FLCInfoForm {
        const user = shipping ? this.taskData.profile.shipping : this.taskData.profile.billing;
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
            cookie: this.cookieJar.serializeSession(),
            'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
        };

        return headers;
    }

    getOrderForm(encCC: CreditCard): FLCOrderForm {
        return new FLCOrderForm(encCC.number, encCC.expiryMonth, encCC.expiryYear, encCC.cvc, (this.taskData as FLTaskData).deviceId as string);
    }

    async dispatchCaptcha(response: AxiosResponse): Promise<void> {
        this.emit(TASK_STATUS, { message: MESSAGES.WAIT_CAPTCHA_MESSAGE, level: 'captcha', checkedSize: this.currentSize });

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

        this.cookieJar.saveInSessionFromString(rawDatadome);
    }

    // Save new waiting_room cookie and set refresh and delay
    dispatchQueue(response: AxiosResponse): void {
        const cookies = response.headers[Headers.SetCookie];
        const refreshHeader = response.headers[Headers.Refresh];
        this.cookieJar.saveInSessionFromString(cookies);

        this.waitingRoom = { refresh: true, delay: this.cookieJar.extractRefresh(refreshHeader) };
        console.log('trying again with quue', this.waitingRoom.delay);
    }

    waitForCaptcha(): { promise: any; cancel: any } {
        let cancel;

        const promise = new Promise((resolve, reject) => {
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
            await this.emitStatusWithDelay(message + err, 'error');
        } else {
            console.log('OTHER STATUS ERROR ,', status);
            await this.emitStatusWithDelay(message + ` (${status})`, 'error');
        }
    }
}
