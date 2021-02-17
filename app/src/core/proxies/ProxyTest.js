const EventEmitter = require('events');
const { PROXY_TEST_SUCCEEDED } = require('../../common/Constants');

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6

class ProxyTest extends EventEmitter{
    constructor(requestInstance, setName, proxy, store) {
        super();
        this.axiosSession = requestInstance.axios;
        this.setName = setName;
        this.proxy = proxy;
        this.url = store.url;
        this.store = store;
    }

    async executeTest() {
        try {
            const time = process.hrtime();
            const response = await this.axiosSession.get(this.url)
                .then((res)=> {
                    const diff = process.hrtime(time);
                    const delay = ((diff[0] * NS_PER_SEC + diff[1])  * MS_PER_NS).toFixed(0);
                    this.emit(PROXY_TEST_SUCCEEDED, { delay: `${ delay } ms`, setName: this.setName, proxy: this.proxy, store: this.store})
                })
                .catch((e) => { console.log(e)})
        } catch (error) {
            if(error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.header);
            } else if(error.request) {
                console.log(error.request)
            } else {
                console.log('Error', error.message);
            }
        }
    }
}

module.exports = { ProxyTest };