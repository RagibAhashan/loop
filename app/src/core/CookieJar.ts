import tough from 'tough-cookie';
import { ua } from './constants/Constants';
import { Cookie } from './constants/Cookies';

export class CookieJar {
    private cookiesMap: Map<string, string>;
    private CookieUtil = tough.Cookie;
    private cookieJar: tough.CookieJar;
    private url: string;

    constructor(url: string) {
        this.cookiesMap = new Map();
        this.cookieJar = new tough.CookieJar();
        this.url = url;
    }

    private current(): void {
        console.log('Current Cookies in session map', this.cookiesMap);
        console.log('Current Cookies in session', this.cookieJar.toJSON());
    }

    /**
     * Gather all set-cookie header array and store them in the cookies map
     *
     * @return {void}
     *
     */
    async saveInSessionFromArray(cookies: string[]): Promise<void> {
        if (cookies.length === 0) return;
        await this.saveInSession(cookies);
    }

    /**
     * Gather a cookie string 'abc=123;123=abc' and store them in the cookies map
     *
     * @return {void}
     *
     */
    async saveInSessionFromString(cookies: string): Promise<void> {
        await this.saveInSession(cookies.split(';'));
    }

    // /**
    //  * Gather all set-cookie header from a puppeteer json object and store them in the cookies map
    //  *
    //  * @return {void}
    //  *
    //  */
    // async saveInSessionFromJSON(cookies: puppeteer.Protocol.Network.Cookie[]): Promise<void> {
    //     if (cookies.length === 0) return;

    //     let cookiesStrArr: string[] = [];

    //     /*
    //      *  because we are also using pupeteer to get some cookies, it only returns cookies in an object format
    //      *  that is not accepted by tough-cookie, so we transform it in string first
    //      */
    //     cookiesStrArr = cookies.map((cookie) => {
    //         return cookieParser.serialize(cookie.name, cookie.value, {
    //             domain: cookie.domain,
    //             expires: new Date(cookie.expires),
    //             httpOnly: cookie.httpOnly,
    //             path: cookie.path,
    //         });
    //     });

    //     await this.saveInSession(cookiesStrArr);
    // }

    private async saveInSession(cookies: string[]): Promise<void> {
        const toughCookieArr = cookies.map((cookie) => this.CookieUtil.parse(cookie));

        // array of tough cookie object
        for (const cookie of toughCookieArr) {
            if (!cookie) continue;

            // if cookie does not match domain for some reason, returns undefined
            const isValidCookie = await this.cookieJar.setCookie(cookie, this.url, { ignoreError: true });

            // For the moment we are keeping this map of cookie key value pair for the get cookie method
            // but it might be useless
            if (isValidCookie) this.cookiesMap.set(cookie.key, cookie.value);
        }

        // TODO remove
        const debug = true;
        if (debug) {
            console.log('reached dbug');
            this.current();
        }
    }

    /**
     * Get all present cookies in the session map and pack them as a string
     * Cookie are serialized based on domain and path match.
     *
     * @return {string} parse cookie string to be used in http header
     *
     */
    serializeSession(): string | undefined {
        const cookies = this.cookieJar.getCookieStringSync(this.url);
        return cookies === '' ? undefined : cookies;
    }

    set(cookie: Cookie, value: string) {
        return this.cookiesMap.set(cookie, value);
    }

    has(cookie: Cookie) {
        return this.cookiesMap.has(cookie);
    }

    getValue(key: Cookie): string | undefined {
        if (!this.cookiesMap.has(key)) return undefined;
        return this.cookiesMap.get(key);
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
