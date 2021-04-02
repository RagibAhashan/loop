import { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { RequestInstance } from './../RequestInstance';
const { PROXY_TEST_SUCCEEDED } = require('../../common/Constants');

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6;

export class ProxyTest extends EventEmitter {
    axiosSession: AxiosInstance;
    setName: string;
    proxy: string;
    url: string;
    store: any;
    constructor(requestInstance: RequestInstance, setName: string, proxy: string, store: any) {
        super();
        this.axiosSession = requestInstance.axios;
        this.setName = setName;
        this.proxy = proxy;
        this.url = store.url;
        this.store = store;
    }

    async executeTest(): Promise<void> {
        try {
            const time = process.hrtime();
            await this.axiosSession
                .get(this.url)
                .then((res: any) => {
                    const diff = process.hrtime(time);
                    const delay = ((diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS).toFixed(0);
                    this.emit(PROXY_TEST_SUCCEEDED, { delay: `${delay} ms`, setName: this.setName, proxy: this.proxy, store: this.store });
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.header);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        }
    }
}
