import { ADYEN_KEY } from './../constants/AdyenKey';
import { CreditCard } from './../interface/UserProfile';
import { FLCInfoForm, FLCOrderForm } from '../interface/FootLockerCA';
import { UserProfile } from '../interface/UserProfile';
import worker, { parentPort } from 'worker_threads';
import { AxiosError, AxiosInstance } from 'axios';
import { Cookie } from '../constants/Cookies';
import { Task } from '../Task';
import { CreditCardEncryption } from './CreditCardEncryption';
import { ContactSupport } from '@material-ui/icons';

export const CAPTCHA_TIMEOUT_SEC = 60;

class FootLockerTask extends Task {
  private static ccEncryptor: CreditCardEncryption = new CreditCardEncryption(
    ADYEN_KEY
  );
  constructor(
    productLink: string,
    productSKU: string,
    size: string,
    deviceId: string,
    axios: AxiosInstance,
    userProfile: UserProfile
  ) {
    super(productLink, productSKU, size, deviceId, axios, userProfile);
  }

  protected async getSessionTokens(): Promise<void> {
    const response = await this.axiosSession.get('/v4/session');

    const cookies = response.headers['set-cookie'].join();
    this.cookieJar.setFromRaw(cookies, Cookie.JSESSIONID);

    const csrf = response.data['data']['csrfToken'];
    this.cookieJar.set(csrf, Cookie.CSRF);
  }

  protected async getProductCode(): Promise<string> {
    const response = await this.axiosSession.get(
      `/products/pdp/${this.productSKU}`
    );
    const sellableUnits = response.data['sellableUnits'];
    const allShoes = sellableUnits
      .filter((unit: any) => unit.stockLevelStatus === 'inStock')
      .map((inStock: any) => {
        const newShoe = { name: '', value: '' };

        inStock.attributes.map((attr: any) => {
          newShoe.name += attr.value + ' ';
          newShoe.value = inStock.code;
        });
        return newShoe;
      });

    return allShoes;
  }
  protected async addToCart(code: string): Promise<void> {
    let added = false;
    while (!added) {
      try {
        console.log('trying to add');
        const headers = {
          referer: this.productLink,
          cookie: this.cookieJar.getCookie(Cookie.JSESSIONID),
          'x-fl-productid': code,
          'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
        };

        if (this.cookieJar.has(Cookie.DATADOME)) {
          headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
          console.log('TRYING AGAIN BUT WITH DATADOME', headers.cookie);
        }

        console.log(headers);

        const body = { productQuantity: '1', productId: code };

        const response = await this.axiosSession.post(
          '/users/carts/current/entries',
          body,
          { headers: headers }
        );

        console.log('getting cookies');
        const cookies = response.headers['set-cookie'].join();
        this.cookieJar.setFromRaw(cookies, Cookie.CART_GUID);

        console.log('Adding to cart OK... ', response.status);
        added = true;
        console.log('CARt GUID', this.cookieJar.getValue(Cookie.CART_GUID));
      } catch (err) {
        // TODO WIP Captcha
        if ((err as AxiosError) && err.response && 'url' in err.response.data) {
          console.log('trying to solve captcha');
          const error = err as AxiosError;
          const cookies = error.response?.headers['set-cookie'][0];
          const capDatadome = this.cookieJar.extract(cookies, Cookie.DATADOME);
          const captcha_url = `${error.response?.data['url']}&cid=${capDatadome}&referer=${this.productLink}`;

          console.log(captcha_url);
          // here post message
          parentPort?.postMessage(captcha_url);

          let receivedDatadome = false;
          let startTime = performance.now();
          let timeout = 0;

          parentPort?.once('datadome', (datadomeRaw: string) => {
            console.log('RECEIVED DATADOME COOKIE !', datadomeRaw);
            this.cookieJar.setFromRaw(datadomeRaw, Cookie.DATADOME);
            receivedDatadome = true;
          });

          // busy wait
          while (!receivedDatadome || timeout > CAPTCHA_TIMEOUT_SEC) {
            timeout = Math.round((performance.now() - startTime) / 1000);
          }

          if (!receivedDatadome)
            throw new Error('Timeout exceeded - Captcha not solved');
        } else {
          console.log('Add to cart failed', err.response.status);
          throw err;
        }
      }
    }
  }
  protected async setEmail(): Promise<void> {
    const headers = {
      referer: 'https://www.footlocker.ca/en/checkout',
      cookie: this.cookieJar.getCookie(Cookie.JSESSIONID, Cookie.CART_GUID),
      'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
    };

    if (this.cookieJar.has(Cookie.DATADOME)) {
      headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
      console.log('TRYING WITH DATADOME', headers.cookie);
    }

    console.log('email headers', headers);

    const response = await this.axiosSession.put(
      `/users/carts/current/email/${this.userProfile.email}`,
      {},
      { headers: headers }
    );

    console.log('Setting Email OK... ', response.status);
  }
  protected async setShipping(): Promise<void> {
    const headers = {
      referer: 'https://www.footlocker.ca/en/checkout',
      cookie: this.cookieJar.getCookie(Cookie.JSESSIONID, Cookie.CART_GUID),
      'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
    };

    if (this.cookieJar.has(Cookie.DATADOME)) {
      headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
      console.log('TRYING WITH DATADOME', headers.cookie);
    }

    const body = { shippingAddress: this.getInfoForm() };

    const response = await this.axiosSession.post(
      '/users/carts/current/addresses/shipping',
      body,
      { headers: headers }
    );

    console.log('Setting Shipping OK... ', response.status);
  }
  protected async setBilling(): Promise<void> {
    const headers = {
      referer: 'https://www.footlocker.ca/en/checkout',
      cookie: this.cookieJar.getCookie(Cookie.JSESSIONID, Cookie.CART_GUID),
      'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
    };

    if (this.cookieJar.has(Cookie.DATADOME)) {
      headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
      console.log('TRYING WITH DATADOME', headers.cookie);
    }

    const body = this.getInfoForm();

    const response = await this.axiosSession.post(
      '/users/carts/current/set-billing',
      body,
      { headers: headers }
    );

    console.log('Setting Billing OK... ', response.status);
  }
  protected async placeOrder(): Promise<void> {
    const headers = {
      referer: 'https://www.footlocker.ca/en/checkout',
      cookie: this.cookieJar.getCookie(Cookie.JSESSIONID, Cookie.CART_GUID),
      'x-csrf-token': this.cookieJar.getValue(Cookie.CSRF),
    };

    if (this.cookieJar.has(Cookie.DATADOME)) {
      headers.cookie += this.cookieJar.getCookie(Cookie.DATADOME);
      console.log('TRYING WITH DATADOME', headers.cookie);
    }

    const encryptedCC = FootLockerTask.ccEncryptor.encrypt(
      this.userProfile.creditCard
    );

    const body = this.getOrderForm(encryptedCC);

    const response = await this.axiosSession.post('/v2/users/orders', body, {
      headers: headers,
    });

    console.log('Placed Order !', response.status);
  }

  protected getInfoForm(): FLCInfoForm {
    return new FLCInfoForm(
      this.userProfile.lastName,
      this.userProfile.email,
      this.userProfile.phone,
      this.userProfile.country,
      this.userProfile.firstName,
      this.userProfile.address,
      this.userProfile.postalCode,
      this.userProfile.region,
      this.userProfile.town
    );
  }

  protected getOrderForm(encCC: CreditCard): FLCOrderForm {
    return new FLCOrderForm(
      encCC.number,
      encCC.expiryMonth,
      encCC.expiryYear,
      encCC.cvc,
      this.deviceId
    );
  }
}