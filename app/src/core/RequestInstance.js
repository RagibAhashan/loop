const axios = require('axios').default;
class RequestInstance {
    constructor(baseURL, params = undefined, headers = undefined, proxy = undefined) {
        this.axios = axios.create({
            baseURL: baseURL,
            params: { params },
            headers: { headers },
            httpsAgent: proxy ? proxy.getAgent() : undefined,
        });
    }
}

module.exports = { RequestInstance };
