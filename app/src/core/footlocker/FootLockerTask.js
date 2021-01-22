const { parentPort } = require('worker_threads');
const { Cookie } = require('../constants/Cookies');
const { FLCInfoForm, FLCOrderForm } = require('../interface/FootLockerCA');
const { Task } = require('../Task');
const { ADYEN_KEY } = require('./../constants/AdyenKey');
const { CreditCardEncryption } = require('./CreditCardEncryption');

const CAPTCHA_TIMEOUT_SEC = 60;

class FootLockerTask extends Task {
    static ccEncryptorEncryption = new CreditCardEncryption(ADYEN_KEY);

    async getSessionTokens() {
        parentPort.postMessage('Getting Session...');

        const response = await this.axiosSession.get('/v4/session');

        const cookies = response.headers['set-cookie'].join();
        this.cookieJar.setFromRaw(cookies, Cookie.JSESSIONID);

        const csrf = response.data['data']['csrfToken'];
        this.cookieJar.set(csrf, Cookie.CSRF);
    }

    async getProductCode() {
        parentPort.postMessage('Checking Size...');

        const response = await this.axiosSession.get(`/products/pdp/${this.productSKU}`);
        const sellableUnits = response.data['sellableUnits'];
        const allShoes = sellableUnits
            .filter((unit) => unit.stockLevelStatus === 'inStock')
            .map((inStock) => {
                const newShoe = { name: '', value: '' };

                inStock.attributes.map((attr) => {
                    newShoe.name += attr.value + ' ';
                    newShoe.value = inStock.code;
                });
                return newShoe;
            });

        return allShoes;
    }
    async addToCart(code) {
        parentPort.postMessage('Adding to cart...');

        let added = false;
        while (!added) {
            try {
                const headers = {
                    referer: this.productLink,
                    cookie: this.cookieJar.getCookie(Cookie.JSESSIONID),
                    'x-fl-productid': code,
                    'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
                };

                if (this.cookieJar.has(Cookie.DATADOME)) {
                    headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
                    console.log('TRYING AGAIN BUT WITH DATADOME', headers.cookie);
                }

                const body = { productQuantity: '1', productId: code };

                const response = await this.axiosSession.post('/users/carts/current/entries', body, { headers: headers });

                const cookies = response.headers['set-cookie'].join();
                this.cookieJar.setFromRaw(cookies, Cookie.CART_GUID);

                console.log('Adding to cart OK... ', response.status);
                added = true;
            } catch (err) {
                // TODO WIP Captcha
                if (err.response && 'url' in err.response.data) {
                    console.log('trying to solve captcha');
                    const cookies = err.response?.headers['set-cookie'][0];
                    const capDatadome = this.cookieJar.extract(cookies, Cookie.DATADOME);
                    const captcha_url = `${err.response?.data['url']}&cid=${capDatadome}&referer=${this.productLink}`;

                    console.log(captcha_url);
                    // here post message
                    parentPort?.postMessage(captcha_url);

                    let receivedDatadome = false;
                    let startTime = performance.now();
                    let timeout = 0;

                    parentPort?.once('datadome', (datadomeRaw) => {
                        console.log('RECEIVED DATADOME COOKIE !', datadomeRaw);
                        this.cookieJar.setFromRaw(datadomeRaw, Cookie.DATADOME);
                        receivedDatadome = true;
                    });

                    // busy wait
                    while (!receivedDatadome || timeout > CAPTCHA_TIMEOUT_SEC) {
                        timeout = Math.round((performance.now() - startTime) / 1000);
                    }

                    if (!receivedDatadome) throw new Error('Timeout exceeded - Captcha not solved');
                } else {
                    // console.log('Add to cart failed', err.response.status);
                    console.log('Add to cart failed', err);
                    throw err;
                }
            }
        }
    }
    async setEmail() {
        parentPort.postMessage('Setting Email...');

        const headers = this.setHeaders();

        const response = await this.axiosSession.put(`/users/carts/current/email/${this.userProfile.email}`, {}, { headers: headers });

        console.log('Setting Email OK... ', response.status);
    }
    async setShipping() {
        parentPort.postMessage('Setting Shipping...');

        const headers = this.setHeaders();

        const body = { shippingAddress: this.getInfoForm() };

        const response = await this.axiosSession.post('/users/carts/current/addresses/shipping', body, { headers: headers });

        console.log('Setting Shipping OK... ', response.status);
    }
    async setBilling() {
        parentPort.postMessage('Setting Billing...');

        const headers = this.setHeaders();

        const body = this.getInfoForm();

        const response = await this.axiosSession.post('/users/carts/current/set-billing', body, { headers: headers });

        console.log('Setting Billing OK... ', response.status);
    }
    async placeOrder() {
        parentPort.postMessage('Placing Order...');

        const headers = this.setHeaders();

        const encryptedCC = FootLockerTask.ccEncryptor.encrypt(this.userProfile.creditCard);

        const body = this.getOrderForm(encryptedCC);

        const response = await this.axiosSession.post('/v2/users/orders', body, {
            headers: headers,
        });

        parentPort.postMessage('Placed Order !');
    }

    getInfoForm() {
        return new FLCInfoForm(
            this.userProfile.lastName,
            this.userProfile.email,
            this.userProfile.phone,
            this.userProfile.country,
            this.userProfile.firstName,
            this.userProfile.address,
            this.userProfile.postalCode,
            this.userProfile.region,
            this.userProfile.town,
        );
    }

    setHeaders() {
        const headers = {
            referer: 'https://www.footlocker.ca/en/checkout',
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
}

module.exports = { FootLockerTask, CAPTCHA_TIMEOUT_SEC };
