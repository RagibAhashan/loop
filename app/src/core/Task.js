const { threadId, parentPort } = require('worker_threads');
const { CookieJar } = require('./CookieJar');

class Task {
    constructor(productLink, productSKU, size, deviceId, requestInstance, userProfile) {
        this.productLink = productLink;
        this.productSKU = productSKU;
        this.size = size;
        this.deviceId = deviceId;
        this.threadId = threadId;
        this.axiosSession = requestInstance.axios;
        this.cookieJar = new CookieJar();
        this.userProfile = userProfile;
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
            await this.getSessionTokens();
            const code = await this.getProductCode();
            await this.addToCart(code);
            await this.setEmail();
            await this.setShipping();
            await this.setBilling();
            await this.placeOrder();
        } catch (err) {
            parentPort.postMessage('There was an error somewhere');
        }
    }
}

module.exports = { Task };
