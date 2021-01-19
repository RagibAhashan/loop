import { Cookie } from './constants/Cookies';
export class CookieJar {
  private cookies: Map<Cookie, string>;

  constructor() {
    this.cookies = new Map();
  }

  private _getCookie(cookie: Cookie): string {
    if (!this.cookies.has(cookie)) throw new Error('Cookie does not exists');
    const value = this.getValue(cookie);
    return `${cookie}=${value};`;
  }

  getCookie(...cookie: Cookie[]): string {
    let cookieString = '';
    cookie.forEach((cookie: Cookie) => {
      cookieString += this._getCookie(cookie);
    });
    return cookieString;
  }

  getValue(cookie: Cookie): string {
    if (!this.cookies.has(cookie)) throw new Error('Cookie does not exists');
    return this.cookies.get(cookie) as string;
  }

  setFromRaw(rawString: string, name: Cookie) {
    const value = this.extract(rawString, name);
    return this.cookies.set(name, value);
  }

  set(cookie: Cookie, value: string) {
    return this.cookies.set(cookie, value);
  }

  has(cookie: Cookie): boolean {
    return this.cookies.has(cookie);
  }

  /**
   * Return a cookie value from its name
   *
   * @return {string} cookie value
   *
   */
  extract(rawString: string, name: Cookie): string {
    const regex = new RegExp(`${name}=([^;]*)`);
    const match = regex.exec(rawString);

    if (!match) throw Error('Cookie could not be extracted');

    return match[1];
  }
}
