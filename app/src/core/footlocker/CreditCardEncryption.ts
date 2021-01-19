import { CreditCard } from './../interface/UserProfile';
console.log('CREDIT CART ENCRYPTOR SHOULD BE CALLED ONECE ONLY !!!!!');

require('browser-env')();
require('./scripts/2615645779051917');

export enum CreditCardField {
  expiryMonth = 'expiryMonth',
  expiryYear = 'expiryYear',
  number = 'number',
  cvc = 'cvc',
}

export class CreditCardEncryption {
  private adyenKey: string;
  private cse: any;
  constructor(adyenKey: string) {
    this.adyenKey = adyenKey;
    this.cse = (global as any).adyen.encrypt.createEncryption(
      this.adyenKey,
      {}
    );
  }

  encrypt(plainCC: CreditCard): CreditCard {
    let encCC = {} as CreditCard;

    encCC.expiryMonth = this.cse.encrypt({
      expiryMonth: plainCC.expiryMonth,
      generationtime: this.generationTime,
    });

    encCC.expiryYear = this.cse.encrypt({
      expiryYear: plainCC.expiryYear,
      generationtime: this.generationTime,
    });

    encCC.number = this.cse.encrypt({
      number: plainCC.number,
      generationtime: this.generationTime,
    });

    encCC.cvc = this.cse.encrypt({
      cvc: plainCC.cvc,
      generationtime: this.generationTime,
    });

    return encCC;
  }

  private get generationTime(): string {
    return new Date().toISOString();
  }
}
