import { UserProfile } from './interface/UserProfile';
import { CookieJar } from './CookieJar';
import worker, { workerData } from 'worker_threads';
import { AxiosInstance } from 'axios';
import { UserInfo } from 'os';
export abstract class Task {
  protected productLink: string;
  protected productSKU: string;
  protected size: string;
  protected deviceId: string;
  protected threadId: number;
  protected axiosSession: AxiosInstance;
  protected cookieJar: CookieJar;
  protected userProfile: UserProfile;

  constructor(
    productLink: string,
    productSKU: string,
    size: string,
    deviceId: string,
    axios: AxiosInstance,
    userProfile: UserProfile
  ) {
    this.productLink = productLink;
    this.productSKU = productSKU;
    this.size = size;
    this.deviceId = deviceId;
    this.threadId = worker.threadId;
    this.axiosSession = axios;
    this.cookieJar = new CookieJar();
    this.userProfile = userProfile;
  }
  protected abstract getSessionTokens(): Promise<void>;
  protected abstract getProductCode(): Promise<string>;
  protected abstract addToCart(code: string): Promise<void>;
  protected abstract setEmail(): Promise<void>;
  protected abstract setShipping(): Promise<void>;
  protected abstract setBilling(): Promise<void>;
  protected abstract placeOrder(): Promise<void>;

  async execute(): Promise<void> {
    await this.getSessionTokens();
    const code = await this.getProductCode();
    await this.addToCart(code);
    await this.setEmail();
    await this.setShipping();
    await this.setBilling();
  }
}
