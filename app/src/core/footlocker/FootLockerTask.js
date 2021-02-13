const { TASK_STATUS, NOTIFY_CAPTCHA_SOLVED } = require('../../common/Constants');
const msgs = require('../constants/Constants');
const { Cookie, Headers } = require('../constants/Cookies');
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
                this.emit('status', { status: msgs.SESSION_INFO_MESSAGE, level: 'info' });

                if (this.waitingRoom.refresh) {
                    this.emit('status', { status: msgs.SESSION_QUEUE_MESSAGE, level: 'info' });
                    await this.waitError(this.waitingRoom.delay).promise;
                }

                const response = await this.axiosSession.get('/v4/session', { headers: headers });
                console.log('yoooo got session');
                this.refresh = false;
                const cookies = response.headers['set-cookie'].join();
                this.cookieJar.setFromRaw(cookies, Cookie.JSESSIONID);

                const csrf = response.data['data']['csrfToken'];
                this.cookieJar.set(Cookie.CSRF, csrf);
            } catch (error) {
                this.cancelTask();
                // If we get a queue page
                if (error.response.headers['set-cookie'] && error.response.headers[Headers.SetCookie].join().includes(Cookie.WAITING_ROOM)) {
                    const cookies = error.response.headers[Headers.SetCookie].join();
                    const refreshHeader = error.response.headers[Headers.Refresh];
                    this.cookieJar.setFromRaw(cookies, Cookie.WAITING_ROOM);
                    headers = { cookie: this.cookieJar.getCookie(Cookie.WAITING_ROOM) };

                    this.waitingRoom = { refresh: true, delay: this.cookieJar.extractRefresh(refreshHeader) };
                } else {
                    await this.emitStatus(msgs.SESSION_ERROR_MESSAGE, 'error');
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
                this.emit('status', { status: msgs.CHECKING_SIZE_INFO_MESSAGE, level: 'info' });

                const response = await this.axiosSession.get(`/products/pdp/${this.productSKU}`);
                console.log(typeof response.data);
                const sellableUnits = response.data['sellableUnits'];
                const variantAttributes = response.data['variantAttributes'];
                const { code: styleCode } = variantAttributes.find((attr) => attr.sku === this.productSKU);

                const inStockUnits = sellableUnits.filter(
                    (unit) => unit.stockLevelStatus === 'inStock' && unit.attributes.some((attr) => attr.id === styleCode && attr.type === 'style'),
                );

                for (const size of this.sizes) {
                    for (const unit of inStockUnits) {
                        for (const attr of unit.attributes) {
                            console.log('currenlty checking size', size);
                            if (attr.type === 'size' && parseFloat(attr.value) === parseFloat(size)) {
                                retry = false; // not needed
                                return attr.id;
                            }
                        }
                    }
                }
                await this.emitStatus(msgs.CHECKING_SIZE_RETRY_MESSAGE, 'error');
            } catch (error) {
                this.cancelTask();
                await this.emitStatus(msgs.CHECKING_SIZE_ERROR_MESSAGE, 'error');
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
                this.emit('status', { status: msgs.ADD_CART_INFO_MESSAGE, level: 'info' });
                const headers = {
                    cookie: this.cookieJar.getCookie(Cookie.JSESSIONID),
                    'x-fl-productid': this.productCode,
                    'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
                };

                if (this.cookieJar.has(Cookie.DATADOME)) {
                    headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
                    console.log('TRYING AGAIN BUT WITH DATADOME', headers.cookie, this.uuid);
                }

                const body = { productQuantity: '1', productId: this.productCode };

                const response = await this.axiosSession.post('/users/carts/current/entries', body, { headers: headers });

                const cookies = response.headers['set-cookie'].join();
                this.cookieJar.setFromRaw(cookies, Cookie.CART_GUID);
            } catch (err) {
                this.cancelTask();
                // TODO WIP Captcha
                if (err.response.data['errors'] && err.response.data['errors']['type'] === 'ProductLowStockException') {
                    await this.emitStatus(msgs.CHECKING_SIZE_RETRY_MESSAGE, 'error');
                    this.productCode = await this.getProductCode();
                } else if (err.response.data['url']) {
                    this.emit('status', { status: msgs.WAIT_CAPTCHA_MESSAGE, level: 'info' });

                    const cookies = err.response.headers['set-cookie'].join();
                    const capDatadome = this.cookieJar.extract(cookies, Cookie.DATADOME);
                    const captcha_url = `${err.response.data['url']}&cid=${capDatadome}`;

                    this.emit('captcha', {
                        uuid: this.uuid,
                        url: captcha_url,
                    });

                    const waitCap = this.waitForCaptcha();
                    this.cancelTimeout = waitCap.cancel;

                    const rawDatadome = await waitCap.promise;

                    this.cookieJar.setFromRaw(rawDatadome, Cookie.DATADOME);
                } else {
                    // console.log('Add to cart failed', err.response.status);
                    await this.emitStatus(msgs.ADD_CART_ERROR_MESSAGE, 'error');
                }

                retry = true;
            }
        } while (retry);
    }
    async setEmail() {
        let retry = false;
        do {
            try {
                this.cancelTask();
                retry = false;
                this.emit('status', { status: msgs.EMAIL_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();

                await this.axiosSession.put(`/users/carts/current/email/${this.userProfile.shipping.email}`, {}, { headers: headers });
            } catch (error) {
                this.cancelTask();
                await this.emitStatus(msgs.EMAIL_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }
    async setShipping() {
        let retry = false;
        do {
            try {
                this.cancelTask();

                retry = false;
                this.emit('status', { status: msgs.SHIPPING_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();

                const body = { shippingAddress: this.getInfoForm(true) };

                await this.axiosSession.post('/users/carts/current/addresses/shipping', body, { headers: headers });
            } catch (error) {
                this.cancelTask();

                await this.emitStatus(msgs.SHIPPING_ERROR_MESSAGE, 'error');
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
                this.emit('status', { status: msgs.BILLING_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();

                const body = this.getInfoForm(false);

                await this.axiosSession.post('/users/carts/current/set-billing', body, { headers: headers });
            } catch (error) {
                this.cancelTask();
                await this.emitStatus(msgs.CHECKOUT_FAILED_MESSAGE, 'error');
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
                this.emit('status', { status: msgs.PLACING_ORDER_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();
                console.log(this.userProfile);
                const body = this.getOrderForm(this.userProfile.payment);

                await this.axiosSession.post('/v2/users/orders', body, {
                    headers: headers,
                });
                this.emit('status', { status: msgs.CHECKOUT_SUCCESS_MESSAGE, level: 'success' });
            } catch (error) {
                console.log(error);
                this.cancelTask();
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
            cookie: this.cookieJar.getCookie(Cookie.JSESSIONID, Cookie.CART_GUID),
            'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
        };

        if (this.cookieJar.has(Cookie.DATADOME)) {
            headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
        }

        return headers;
    }

    getOrderForm(encCC) {
        return new FLCOrderForm(encCC.number, encCC.expiryMonth, encCC.expiryYear, encCC.cvc, this.deviceId);
    }

    cancelTask() {
        if (this.cancel) throw new Error(CANCEL_ERROR);
    }

    async emitStatus(message, level) {
        this.emit(TASK_STATUS, { status: message, level: level });
        const wait = this.waitError(this.retryDelay);
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
