class ProxyTest {
    constructor(setName, axios) {
        super(setName, axios);
    }

    async executeTest() {
        return (setName)
    }

    async emitStatus(message, level) {
        this.emit('status', { status: message, level: level });
    }
}

module.exports = { ProxyTest };