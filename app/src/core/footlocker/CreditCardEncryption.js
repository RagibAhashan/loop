console.log('CREDIT CART ENCRYPTOR SHOULD BE CALLED ONECE ONLY !!!!!');

require('browser-env')();
require('./scripts/2615645779051917');

class CreditCardEncryption {
    adyenKey;
    cse;
    constructor(adyenKey) {
        this.adyenKey = adyenKey;
        this.cse = global.adyen.encrypt.createEncryption(this.adyenKey, {});
    }

    encrypt(plainCC) {
        let encCC = {};

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

    get generationTime() {
        return new Date().toISOString();
    }
}

module.exports = { CreditCardEncryption };
