import { Proxy } from './Proxy';
import axios, { AxiosInstance } from 'axios';
export class RequestInstance {
  axios: AxiosInstance;
  constructor(
    baseURL: string,
    params?: Object,
    headers?: Object,
    proxy?: Proxy
  ) {
    this.axios = axios.create({
      baseURL: baseURL,
      params: { params },
      headers: { headers },
      httpsAgent: proxy?.getAgent(),
    });
  }
}
