const { default: axios } = require('axios');
const EventEmitter = require('events');

class ProxyTest extends EventEmitter{
    constructor(setName, requestInstance) {
        super();
        this.setName = setName;
        this.axiosSession = requestInstance.axios;
    }

    async executeTest() {
        try { 
            const response = await this.axiosSession.get('/');
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        return 'Executing test..'
    }

    async emitStatus(message, level) {
        // 
    }
}

module.exports = { ProxyTest };