const EventEmitter = require('events');
const { CookieJar } = require('./CookieJar');

class Task extends EventEmitter {
    constructor(productLink, productSKU, sizes, deviceId, requestInstance, userProfile) {
        super();
        this.productLink = productLink;
        this.productSKU = productSKU;
        this.sizes = sizes;
        this.deviceId = deviceId;
        this.axiosSession = requestInstance.axios;
        this.cookieJar = new CookieJar();
        this.userProfile = userProfile;
        this.productCode = '';
    }
    getSessionTokens() {
        throw new Error('Method must be implemented');
    }
    getProductCode() {
        throw new Error('Method must be implemented');
    }
    addToCart(code) {
        throw new Error('Method must be implemented');
    }
    setEmail() {
        throw new Error('Method must be implemented');
    }
    setShipping() {
        throw new Error('Method must be implemented');
    }
    setBilling() {
        throw new Error('Method must be implemented');
    }
    placeOrder() {
        throw new Error('Method must be implemented');
    }

    async execute() {
        try {
            this.on('stop', () => {
                console.log('got stop task !!!!');
                throw new Error('Task Canceled');
            });
            await this.getSessionTokens();
            this.productCode = await this.getProductCode();
            await this.addToCart();
            await this.setEmail();
            await this.setShipping();
            await this.setBilling();
            await this.placeOrder();
        } catch (err) {
            console.log('error', err);
        }
    }
}

module.exports = { Task };
