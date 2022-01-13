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
     * @param {cookies} cookies
     *
     * list of cookies in a string format : ['name=value; attributes;values', 'name2=value2; attributes2;values2']
     *
     * @return {void}
     *
     */
    public async saveInSessionFromArray(cookies: string[]): Promise<void> {
        if (cookies.length === 0) return;

        const toughCookieArr = cookies.map((cookie) => this.CookieUtil.parse(cookie));

        await this.saveInSession(toughCookieArr);
    }

    /**
     * Gather a cookie string 'abc=123;123=abc' and store them in the cookies map
     *
     * @param {cookie}
     *
     * cookie string in the same format returned by document.cookie :
     * that is 'name1=value1; name2=value2; name3=value3`
     *
     * @return {void}
     *
     */
    public async saveInSessionFromDocumentCookie(cookies: string): Promise<void> {
        const cookiesArr = cookies.split(';');
        const toughCookieArr = cookiesArr.map((cookie) => this.CookieUtil.parse(cookie));

        await this.saveInSession(toughCookieArr);
    }

    /**
     * Gather json cookies and store them in the cookie jar
     *
     * @param {cookies} list of object in this form
     *
     * {
     * name: 'name',
     * value: '1',
     * domain: 'www.',
     * path: '/',
     * expires: 345345,
     * size: 17,
     * httpOnly: false,
     * secure: true,
     * session: false,
     * sameSite: 'Strict',
     * sameParty: false,
     * sourceScheme: 'Secure',
     * sourcePort: 443
     * }
     *
     * @return {void}
     *
     */
    async saveInSessionFromJSON(cookiesJSON: any[]): Promise<void> {
        const toughCookie = cookiesJSON.map((cookieJSON) => tough.fromJSON(cookieJSON));

        await this.saveInSession(toughCookie);
    }

    private async saveInSession(cookies: (tough.Cookie | undefined)[]): Promise<void> {
        // array of tough cookie object
        for (const cookie of cookies) {
            if (!cookie) continue;

            // if cookie does not match domain for some reason, returns undefined
            const isValidCookie = await this.cookieJar.setCookie(cookie, this.url, { ignoreError: true });

            // For the moment we are keeping this map of cookie key value pair for the get cookie method
            // but it might be useless
            if (isValidCookie) this.cookiesMap.set(cookie.key, cookie.value);
        }

        // TODO remove
        const debug = false;
        if (debug) {
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
