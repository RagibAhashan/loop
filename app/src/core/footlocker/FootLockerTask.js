const { TASK_STATUS, NOTIFY_CAPTCHA_SOLVED, TASK_SUCCESS } = require('../../common/Constants');
const msgs = require('../constants/Constants');
const { Cookie, Headers } = require('../constants/Cookies');
const { ERRORS_SHIPPING, ERRORS_PAYMENT, ERRORS_CART } = require('../constants/FootLocker');
const { FLCInfoForm, FLCOrderForm } = require('../interface/FootLockerCA');
const { Task, CANCEL_ERROR } = require('../Task');

class FootLockerTask extends Task {
    constructor(uuid, productSKU, sizes, deviceId, requestInstance, userProfile, retryDelay) {
        super(uuid, productSKU, sizes, deviceId, requestInstance, userProfile);
        this.retryDelay = retryDelay;
        this.captchaSolved = false;
    }
    async getSessionTokens() {
        let retry = false;
        this.waitingRoom = { refresh: false, delay: 0 };
        let headers = {};
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { status: msgs.SESSION_INFO_MESSAGE, level: 'info' });

                if (this.waitingRoom.refresh) {
                    await this.emitStatus(msgs.SESSION_QUEUE_MESSAGE, 'info', this.waitingRoom.delay);
                }

                const response = await this.axiosSession.get('/v4/session', { headers: headers });
                this.waitingRoom.refresh = false;
                const cookies = response.headers['set-cookie'].join();
                this.cookieJar.setFromRaw(cookies, Cookie.JSESSIONID);

                const csrf = response.data['data']['csrfToken'];
                this.cookieJar.set(Cookie.CSRF, csrf);
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    // If we get a queue page
                    if (response.headers['set-cookie'] && response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                        const cookies = error.response.headers[Headers.SetCookie].join();
                        const refreshHeader = error.response.headers[Headers.Refresh];
                        this.cookieJar.setFromRaw(cookies, Cookie.WAITING_ROOM);
                        headers = { cookie: this.cookieJar.getCookie(Cookie.WAITING_ROOM) };

                        this.waitingRoom = { refresh: true, delay: this.cookieJar.extractRefresh(refreshHeader) };
                    }
                } else if (error.request) {
                    await this.emitStatus(msgs.SESSION_ERROR_MESSAGE, 'error');
                } else {
                    // console.log('SESSION OTHER ERROR', error);
                }
                retry = true;
            }
        } while (retry);
    }

    async getProductCode() {
        let retry = true;
        do {
            try {
                this.cancelTask();
                this.emit(TASK_STATUS, { status: msgs.CHECKING_SIZE_INFO_MESSAGE, level: 'info' });

                const response = await this.axiosSession.get(`/products/pdp/${this.productSKU}`);
                const sellableUnits = response.data['sellableUnits'];
                const variantAttributes = response.data['variantAttributes'];
                const { code: styleCode } = variantAttributes.find((attr) => attr.sku === this.productSKU);

                const inStockUnits = sellableUnits.filter(
                    (unit) => unit.stockLevelStatus === 'inStock' && unit.attributes.some((attr) => attr.id === styleCode && attr.type === 'style'),
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
                await this.emitStatus(msgs.CHECKING_SIZE_RETRY_MESSAGE, 'error');
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    // console.log('checking stock error response', response);
                    await this.emitStatus(msgs.CHECKING_SIZE_ERROR_MESSAGE, 'error');
                } else if (error.request) {
                    // console.log('CHECKING STOCK ERROR without request wtf', error);

                    await this.emitStatus(msgs.CHECKING_SIZE_ERROR_MESSAGE, 'error');
                } else {
                    // console.log('CHECKING STOCK OTHER ERROR', error);
                }
                retry = true;
            }
        } while (retry);
    }
    async addToCart() {
        let retry = false;
        do {
            try {
                retry = false;
                this.cancelTask();
                this.emit(TASK_STATUS, {
                    status: msgs.ADD_CART_INFO_MESSAGE + ` (${this.currentSize})`,
                    level: 'info',
                    checkedSize: this.currentSize,
                });
                const headers = {
                    cookie: this.cookieJar.getCookie(Cookie.JSESSIONID),
                    'x-fl-productid': this.productCode,
                    'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
                };

                if (this.cookieJar.has(Cookie.DATADOME)) {
                    headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
                }

                const body = { productQuantity: '1', productId: this.productCode };

                const response = await this.axiosSession.post('/users/carts/current/entries', body, { headers: headers });

                const cookies = response.headers['set-cookie'].join();
                this.cookieJar.setFromRaw(cookies, Cookie.CART_GUID);
                this.cookieJar.setFromRaw(cookies, Cookie.DATADOME);
            } catch (err) {
                this.cancelTask();
                const response = err.response;
                console.log('add', response.data);
                if (response) {
                    const oosError = response.data.errors ? ERRORS_CART[response.data.errors[0].type] : undefined;
                    if (oosError) {
                        await this.emitStatus(msgs.CHECKING_SIZE_RETRY_MESSAGE, 'error');
                        this.productCode = await this.getProductCode();
                    } else if (response.data['url']) {
                        await this.dispatchCaptcha(response);
                    } else {
                        await this.emitStatus(msgs.ADD_CART_ERROR_MESSAGE, 'error');
                    }
                } else if (err.request) {
                    // console.log('ADDING TO CARD error withtou response here', err);
                    await this.emitStatus(msgs.ADD_CART_ERROR_MESSAGE, 'error');
                } else {
                    // console.log('ADDING TO CART OTHER ERROR ', err);
                    await this.emitStatus(msgs.ADD_CART_ERROR_MESSAGE, 'error');
                }

                retry = true;
            }
        } while (retry);
    }
    async setBilling() {
        let retry = false;
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { status: msgs.BILLING_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();

                await this.axiosSession.put(`/users/carts/current/email/${this.userProfile.shipping.email}`, {}, { headers: headers });

                const userShipping = { shippingAddress: this.getInfoForm(true) };
                await this.axiosSession.post('/users/carts/current/addresses/shipping', userShipping, { headers: headers });

                const userBilling = this.getInfoForm(false);
                await this.axiosSession.post('/users/carts/current/set-billing', userBilling, { headers: headers });
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    const dataError = response.data.errors;
                    // console.log('BILLING ERRORS', dataError, response);
                    if (dataError && ERRORS_SHIPPING[error.response.data.errors[0].code]) {
                        this.emit(TASK_STATUS, { status: ERRORS_SHIPPING[error.response.data.errors[0].code], level: 'cancel' });
                        this.cancelTask();
                    } else if (response.data['url']) {
                        await this.dispatchCaptcha(response);
                    }
                } else if (error.request) {
                    // console.log('BILLING OTHER WIHTOUT RESPONSE HERE ERROR', error);
                } else {
                    // console.log('BILLING OTHER ERROR', error);
                }
                await this.emitStatus(msgs.BILLING_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }

    async placeOrder() {
        let retry = false;
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit(TASK_STATUS, { status: msgs.PLACING_ORDER_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();
                const body = this.getOrderForm(this.userProfile.payment);

                await this.axiosSession.post('/v2/users/orders', body, {
                    headers: headers,
                });
                this.emit(TASK_STATUS, { status: msgs.CHECKOUT_SUCCESS_MESSAGE, level: 'success', checkedSize: this.currentSize });
                this.emit(TASK_SUCCESS);
            } catch (error) {
                this.cancelTask();
                const response = error.response;
                if (response) {
                    const terminateError = response.data.errors ? ERRORS_PAYMENT[error.response.data.errors[0].code] : undefined;
                    if (terminateError) {
                        this.emit(TASK_STATUS, { status: terminateError, level: 'cancel' });
                        throw new Error(CANCEL_ERROR);
                    }
                } else if (error.request) {
                    // console.log('OTHER PLACE ORDER without response HERE', error);
                } else {
                    // console.log('OTHER PLACE ORDER ERROR HERE', error);
                }

                await this.emitStatus(msgs.CHECKOUT_FAILED_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }

    getInfoForm(shipping) {
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

    setHeaders() {
        const headers = {
            cookie: this.cookieJar.getCookie(Cookie.JSESSIONID, Cookie.CART_GUID, Cookie.DATADOME),
            'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
        };

        return headers;
    }

    getOrderForm(encCC) {
        return new FLCOrderForm(encCC.number, encCC.expiryMonth, encCC.expiryYear, encCC.cvc, this.deviceId);
    }

    cancelTask() {
        if (this.cancel) throw new Error(CANCEL_ERROR);
    }

    async emitStatus(message, level, delay = undefined) {
        this.emit(TASK_STATUS, { status: message, level: level });
        const wait = this.waitError(delay ? delay : this.retryDelay);
        this.cancelTimeout = wait.cancel;
        // this is is promise not a function
        return wait.promise;
    }

    // This func will return one promise that will act as a sleep for the error message
    // and a cancel sleep so we dont wait the whole retry delay when we cancel our task during an error
    waitError(customDelay = undefined) {
        let timeout, promise, cancel;

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

    async dispatchCaptcha(response) {
        this.emit(TASK_STATUS, { status: msgs.WAIT_CAPTCHA_MESSAGE, level: 'info' });

        const cookies = response.headers['set-cookie'].join();
        const capDatadome = this.cookieJar.extract(cookies, Cookie.DATADOME);
        const captcha_url = `${response.data['url']}&cid=${capDatadome}`;

        this.emit('captcha', {
            uuid: this.uuid,
            url: captcha_url,
        });

        const waitCap = this.waitForCaptcha();
        this.cancelTimeout = waitCap.cancel;

        const rawDatadome = await waitCap.promise;

        this.cookieJar.setFromRaw(rawDatadome, Cookie.DATADOME);
    }

    waitForCaptcha() {
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
}

module.exports = { FootLockerTask };
