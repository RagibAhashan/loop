
class ProxyTest {
    constructor(setName, axios) {
        super(setName, axios);
    }

    async emitStatus(message, level) {
        this.emit('status', { status: message, level: level });
        await this.waitError(this.retryDelay);
    }
}

module.exports = { ProxyTest };