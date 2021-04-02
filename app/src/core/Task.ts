import { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { TASK_STATUS, TASK_STOP, TASK_STOPPED } from '../common/Constants';
import { UserProfile } from './../interfaces/TaskInterfaces';
import { MESSAGES } from './constants/Constants';
import { CookieJar } from './CookieJar';
import { RequestInstance } from './RequestInstance';

export const CANCEL_ERROR = 'Cancel';
export abstract class Task extends EventEmitter {
    protected productSKU: string;
    protected sizes: string[];
    protected deviceId: string;
    protected requestInstance: RequestInstance;
    protected userProfile: UserProfile;
    protected cookieJar: any;
    protected productCode: string;
    protected cancel: boolean;
    protected cancelTimeout: () => void;
    protected uuid: string;
    protected currentSize: string;
    protected axiosSession: AxiosInstance;

    constructor(uuid: string, productSKU: string, sizes: string[], deviceId: string, requestInstance: RequestInstance, userProfile: UserProfile) {
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

    abstract getSessionTokens(): Promise<void>;
    abstract getProductCode(): Promise<string>;
    abstract addToCart(): Promise<void>;
    abstract setBilling(): Promise<void>;
    abstract placeOrder(): Promise<void>;

    updateProxy(proxyData: any): void {
        this.requestInstance.updateProxy(proxyData);
    }

    async execute(): Promise<void> {
        try {
            this.cookieJar = new CookieJar();

            console.log('proxy used', this.requestInstance.proxy);

            this.cancel = false;

            this.once(TASK_STOP, async () => {
                this.cancel = true;
                this.emit(TASK_STATUS, { status: MESSAGES.CANCELED_MESSAGE, level: 'cancel' });
                this.requestInstance.cancel();
                this.cancelTimeout();
            });

            await this.getSessionTokens();

            this.productCode = await this.getProductCode();

            await this.addToCart();

            await this.setBilling();

            await this.placeOrder();
        } catch (err) {
            // console.log('execute error', err);
            // waitError cancel would reject promise so error could equal to CANCEL_ERROR
            this.emit(TASK_STOPPED);
            // do nothing
        }
    }
}
