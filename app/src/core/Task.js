const EventEmitter = require('events');
const { CookieJar } = require('./CookieJar');
const msgs = require('./constants/Constants');
const { TASK_STOPPED, TASK_STATUS, TASK_SUCCESS, TASK_STOP } = require('../common/Constants');

const CANCEL_ERROR = 'Cancel';
class Task extends EventEmitter {
    constructor(uuid, productSKU, sizes, deviceId, requestInstance, userProfile) {
        super();
        this.productSKU = productSKU;
        this.sizes = sizes;
        this.deviceId = deviceId;
        this.requestInstance = requestInstance;
        this.axiosSession = requestInstance.axios;
        this.cookieJar = new CookieJar();
        this.userProfile = userProfile;
        this.productCode = '';
        this.cancel = false;
        this.cancelTimeout = () => {};
        this.uuid = uuid;
        this.currentSize = '';
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
            this.cancel = false;
            this.once(TASK_STOP, async () => {
                this.cancel = true;
                this.emit(TASK_STATUS, { status: msgs.CANCELED_MESSAGE, level: 'cancel' });
                this.requestInstance.cancel();
                this.cancelTimeout();
            });

            await this.getSessionTokens();
            this.productCode = await this.getProductCode();
            await this.addToCart();
            await this.setEmail();
            await this.setShipping();
            await this.setBilling();

            await this.placeOrder();
        } catch (err) {
            console.log('execute error', err);
            // waitError cancel would reject promise so error could equal to CANCEL_ERROR
            this.emit(TASK_STOPPED);
            // do nothing
        }
    }
}

module.exports = { Task, CANCEL_ERROR };
