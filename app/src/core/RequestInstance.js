const axios = require('axios').default;
const CancelToken = axios.CancelToken;
class RequestInstance {
    constructor(baseURL, params = undefined, headers = undefined, proxy = undefined) {
        this.source = CancelToken.source();
        this.axios = axios.create({
            baseURL: baseURL,
            params: params,
            headers: headers,
            httpsAgent: proxy ? proxy.getAgent() : undefined,
            cancelToken: this.source.token,
        });
    }

    cancel() {
        this.source.cancel('This bitch got canceled');
        //Get another source token
        this.source = CancelToken.source();
        this.axios.defaults.cancelToken = this.source.token;
    }
}

module.exports = { RequestInstance };
