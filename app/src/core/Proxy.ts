import { HttpsProxyAgent } from 'https-proxy-agent';

export class Proxy {
  host: string;
  port: string;
  private httpsAgent: HttpsProxyAgent;
  constructor(host: string, port: string) {
    this.host = host;
    this.port = port;

    this.httpsAgent = new HttpsProxyAgent(`http://${this.host}:${this.port}`);
  }

  getAgent(): HttpsProxyAgent {
    return this.httpsAgent;
  }
}
