export interface CreditCardFormData {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    cardHolderName: string;
}

export interface ICreditCard {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    cardHolderName: string;
    truncatedNumber: string;
}

export class CreditCard implements ICreditCard {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    cardHolderName: string;

    constructor(number: string, expiryMonth: string, expiryYear: string, cvc: string, cardHolderName: string) {
        this.number = number;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.cvc = cvc;
        this.cardHolderName = cardHolderName;
    }

    public getValueDB(): ICreditCard {
        return {
            cardHolderName: this.cardHolderName,
            truncatedNumber: this.truncatedNumber,
            expiryMonth: this.expiryMonth,
            expiryYear: this.expiryYear,
            cvc: '',
            number: '',
        };
    }
    /*
    Returns unreadable PAN format (last 4 digits) used for storage
    */
    get truncatedNumber(): string {
        if (!this.number) return '';
        return this.number.substring(this.number.length - 4, this.number.length);
    }
}
