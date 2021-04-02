import { ua } from './constants/Constants';
import { Cookie } from './constants/Cookies';

export class CookieJar {
    private cookies: Map<Cookie, string>;
    constructor() {
        this.cookies = new Map();
    }

    _getCookie(cookie: Cookie) {
        if (!this.cookies.has(cookie)) return '';
        const value = this.getValue(cookie);
        return `${cookie}=${value};`;
    }

    getCookie(...cookie: Cookie[]) {
        let cookieString = '';
        cookie.forEach((cookie) => {
            cookieString += this._getCookie(cookie);
        });
        return cookieString;
    }

    getValue(cookie: Cookie): string | undefined {
        if (!this.cookies.has(cookie)) return undefined;
        return this.cookies.get(cookie);
    }

    setFromRaw(rawString: string, name: Cookie): void {
        const value = this.extract(rawString, name);

        if (value) {
            this.cookies.set(name, value);
        }
    }

    set(cookie: Cookie, value: string) {
        return this.cookies.set(cookie, value);
    }

    has(cookie: Cookie) {
        return this.cookies.has(cookie);
    }

    /**
     * Return a cookie value from its name
     *
     * @return {string} cookie value
     *
     */
    extract(rawString: string, name: string): string | undefined {
        const regex = new RegExp(`${name}=([^;]*)`);
        const match = regex.exec(rawString);

        if (!match) return undefined;

        return match[1];
    }

    /**
     * Return the refresh seconds in Refresh header
     *
     * @return {number} refresh delay in ms
     *
     */
    extractRefresh(rawString: string): number {
        const regex = new RegExp('(\\d[^;])');
        const match = regex.exec(rawString);
        if (!match) throw Error('Refresh could not be extracted');

        return parseInt(match[0]) * 1000;
    }

    // extractQueryParams(rawString) {
    //     const regex = new RegExp(/(\?|&)([^=]+)=([^&]+)/g);
    //     const params = [];
    //     let match;

    //     while ((match = regex.exec(rawString))) {
    //         params.push({ [match[2]]: match[3] });
    //     }

    //     return params;
    // }

    extractQueryParams(urlString: string) {
        const url = new URL(urlString);

        return {
            icid: url.searchParams.get('initialCid'),
            referer: url.searchParams.get('referer'),
            hash: url.searchParams.get('hash'),
            cid: url.searchParams.get('cid'),
            ua: ua,
        };
    }
}
