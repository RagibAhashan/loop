const msgs = require('../constants/Constants');
const { Cookie } = require('../constants/Cookies');
const { FLCInfoForm, FLCOrderForm } = require('../interface/FootLockerCA');
const { Task } = require('../Task');

class FootLockerTask extends Task {
    constructor(uuid, productSKU, sizes, deviceId, requestInstance, userProfile, retryDelay) {
        super(uuid, productSKU, sizes, deviceId, requestInstance, userProfile);
        this.retryDelay = retryDelay;
        this.captchaSolved = false;
    }
    async getSessionTokens() {
        let retry = false;
        do {
            try {
                if (this.cancel) return;
                retry = false;
                this.emit('status', { status: msgs.SESSION_INFO_MESSAGE, level: 'info' });

                const response = await this.axiosSession.get('/v4/session');
                if (this.cancel) return;

                const cookies = response.headers['set-cookie'].join();
                this.cookieJar.setFromRaw(cookies, Cookie.JSESSIONID);

                const csrf = response.data['data']['csrfToken'];
                this.cookieJar.set(Cookie.CSRF, csrf);
            } catch (error) {
                if (this.cancel) return;
                await this.emitStatus(msgs.SESSION_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }

    async getProductCode() {
        let retry = true;
        do {
            try {
                if (this.cancel) return;
                this.emit('status', { status: msgs.CHECKING_SIZE_INFO_MESSAGE, level: 'info' });

                const response = await this.axiosSession.get(`/products/pdp/${this.productSKU}`);
                if (this.cancel) return;
                const sellableUnits = response.data['sellableUnits'];
                const variantAttributes = response.data['variantAttributes'];

                const { code: styleCode } = variantAttributes.find((attr) => attr.sku === this.productSKU);

                const inStockUnits = sellableUnits.filter(
                    (unit) => unit.stockLevelStatus === 'inStock' && unit.attributes.some((attr) => attr.id === styleCode && attr.type === 'style'),
                );

                for (const size of this.sizes) {
                    for (const unit of inStockUnits) {
                        for (const attr of unit.attributes) {
                            if (attr.type === 'size' && parseFloat(attr.value) === parseFloat(size)) {
                                retry = false; // not needed
                                return attr.id;
                            }
                        }
                    }
                }
                this.emit('status', { status: msgs.CHECKING_SIZE_RETRY_MESSAGE, level: 'error' });
                await this.waitError();
            } catch (error) {
                if (this.cancel) return;
                await this.emitStatus(msgs.CHECKING_SIZE_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }
    async addToCart() {
        let retry = false;
        do {
            try {
                if (this.cancel) return;
                this.emit('status', { status: msgs.ADD_CART_INFO_MESSAGE, level: 'info' });
                const headers = {
                    cookie: this.cookieJar.getCookie(Cookie.JSESSIONID),
                    'x-fl-productid': this.productCode,
                    'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
                };

                if (this.cookieJar.has(Cookie.DATADOME)) {
                    headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
                    console.log('TRYING AGAIN BUT WITH DATADOME', headers.cookie);
                }

                const body = { productQuantity: '1', productId: this.productCode };

                const response = await this.axiosSession.post('/users/carts/current/entries', body, { headers: headers });
                if (this.cancel) return;

                const cookies = response.headers['set-cookie'].join();
                this.cookieJar.setFromRaw(cookies, Cookie.CART_GUID);
            } catch (err) {
                if (this.cancel) return;
                // TODO WIP Captcha
                if (err.response.data['errors'] && err.response.data['errors']['type'] === 'ProductLowStockException') {
                    await this.emitStatus(msgs.CHECKING_SIZE_RETRY_MESSAGE, 'error');
                    this.productCode = await this.getProductCode();
                } else if (err.response.data['url']) {
                    this.emit('status', { status: msgs.WAIT_CAPTCHA_MESSAGE, level: 'info' });

                    const cookies = err.response.headers['set-cookie'].join();
                    const capDatadome = this.cookieJar.extract(cookies, Cookie.DATADOME);
                    const captcha_url = `${err.response.data['url']}&cid=${capDatadome}`;

                    this.emit('captcha', { uuid: this.uuid, url: captcha_url });
                    // parentPort?.postMessage(captcha_url);
                    // let receivedDatadome = false;
                    // let startTime = performance.now();
                    // let timeout = 0;
                    // parentPort?.once('datadome', (datadomeRaw) => {
                    //     console.log('RECEIVED DATADOME COOKIE !', datadomeRaw);
                    //     this.cookieJar.setFromRaw(datadomeRaw, Cookie.DATADOME);
                    //     receivedDatadome = true;
                    // });
                    // busy wait
                    await this.waitError(10000);

                    this.once('captcha-solved', () => {
                        console.log('captcha should be solved here');
                    });

                    // await this.waitForCaptcha();
                    // while (!receivedDatadome || timeout > CAPTCHA_TIMEOUT_SEC) {
                    //     timeout = Math.round((performance.now() - startTime) / 1000);
                    // }
                    // if (!receivedDatadome) throw new Error('Timeout exceeded - Captcha not solved');
                } else {
                    // console.log('Add to cart failed', err.response.status);
                    console.log('retry delay', err);
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
                if (this.cancel) return;
                retry = false;
                this.emit('status', { status: msgs.EMAIL_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();

                await this.axiosSession.put(`/users/carts/current/email/${this.userProfile.shipping.email}`, {}, { headers: headers });
                if (this.cancel) return;
            } catch (error) {
                if (this.cancel) return;
                await this.emitStatus(msgs.EMAIL_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }
    async setShipping() {
        let retry = false;
        do {
            try {
                if (this.cancel) return;
                retry = false;
                this.emit('status', { status: msgs.SHIPPING_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();

                const body = { shippingAddress: this.getInfoForm(true) };

                await this.axiosSession.post('/users/carts/current/addresses/shipping', body, { headers: headers });
                if (this.cancel) return;
            } catch (error) {
                if (this.cancel) return;

                await this.emitStatus(msgs.SHIPPING_ERROR_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }
    async setBilling() {
        let retry = false;
        do {
            try {
                if (this.cancel) return;
                retry = false;
                this.emit('status', { status: msgs.BILLING_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();

                const body = this.getInfoForm(false);

                await this.axiosSession.post('/users/carts/current/set-billing', body, { headers: headers });
                if (this.cancel) return;
            } catch (error) {
                if (this.cancel) return;
                await this.emitStatus(msgs.CHECKOUT_FAILED_MESSAGE, 'error');
                retry = true;
            }
        } while (retry);
    }
    async placeOrder() {
        let retry = false;
        do {
            try {
                if (this.cancel) return;
                retry = false;
                this.emit('status', { status: msgs.PLACING_ORDER_INFO_MESSAGE, level: 'info' });

                const headers = this.setHeaders();

                const body = this.getOrderForm({ number: '', expiryMonth: '', expiryYear: '', cvc: '' });

                await this.axiosSession.post('/v2/users/orders', body, {
                    headers: headers,
                });
                if (this.cancel) return;
                this.emit('status', { status: msgs.CHECKOUT_SUCCESS_MESSAGE, level: 'success' });
            } catch (error) {
                if (this.cancel) return;
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

    async emitStatus(message, level) {
        this.emit('status', { status: message, level: level });
        await this.waitError(this.retryDelay);
    }

    async waitError(customDelay = undefined) {
        let delay = customDelay ? customDelay : 300;
        return new Promise((r) => setTimeout(r, delay));
    }

    async waitForCaptcha() {
        while (!this.captchaSolved) {}

        return Promise.resolve('Solved');
    }
}

module.exports = { FootLockerTask };
