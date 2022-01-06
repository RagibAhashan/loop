import { CreditCard, CreditCardFormData } from './credit-card';
import { debug } from './log';

const log = debug.extend('CreditCardFactory');

export class CreditCardFactory {
    public createCreditCard(cc: CreditCardFormData): CreditCard {
        // expiryMonth: string, expiryYear: string, cvc: string, cardHolderName: string
        const newPayment = new CreditCard(cc.number, cc.expiryMonth, cc.expiryYear, cc.cvc, cc.cardHolderName);

        log('CreditCard created');
        return newPayment;
    }
}
