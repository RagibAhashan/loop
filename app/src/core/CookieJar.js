class CookieJar {
    constructor() {
        this.cookies = new Map();
    }

    _getCookie(cookie) {
        if (!this.cookies.has(cookie)) throw new Error('Cookie does not exists');
        const value = this.getValue(cookie);
        return `${cookie}=${value};`;
    }

    getCookie(...cookie) {
        let cookieString = '';
        cookie.forEach((cookie) => {
            cookieString += this._getCookie(cookie);
        });
        return cookieString;
    }

    getValue(cookie) {
        if (!this.cookies.has(cookie)) throw new Error('Cookie does not exists');
        return this.cookies.get(cookie);
    }

    setFromRaw(rawString, name) {
        const value = this.extract(rawString, name);
        return this.cookies.set(name, value);
    }

    set(cookie, value) {
        return this.cookies.set(cookie, value);
    }

    has(cookie) {
        return this.cookies.has(cookie);
    }

    /**
     * Return a cookie value from its name
     *
     * @return {string} cookie value
     *
     */
    extract(rawString, name) {
        const regex = new RegExp(`${name}=([^;]*)`);
        const match = regex.exec(rawString);

        if (!match) throw Error('Cookie could not be extracted');

        return match[1];
    }
}

module.exports = { CookieJar };
