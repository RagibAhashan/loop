import axios from 'axios';
import { CreditCard, WalmartCreditCard } from './../../core/interface/UserProfile';
require('../../core/walmart/scripts/WalmartEncryption');

interface IPIE {
    [key: string]: string | number;
}
interface PIE extends IPIE {
    L: number;
    E: number;
    K: string;
    key_id: string;
    phase: number;
}
type EncryptFunction = (number: string, cvc: string, format: boolean, PIE: PIE) => string[];

const KEY_URL = 'https://securedataweb.walmart.com/pie/v1/wmcom_us_vtg_pie/getkey.js?bust=';
export class WalmartEncryption {
    private walmartEncrypt: EncryptFunction;

    constructor() {
        this.walmartEncrypt = (global as any).EncryptWalmart; // check core/walmart/scripts/WalmartEncryption
    }
    async encrypt(plainCC: CreditCard): Promise<WalmartCreditCard> {
        try {
            const PIE = await this.fetchPIE();

            const [encryptedNumber, encryptedCVC, integrityCheck] = this.walmartEncrypt(plainCC.number, plainCC.cvc, true, PIE);

            return {
                ...plainCC,
                number: encryptedNumber,
                cvc: encryptedCVC,
                integrityCheck: integrityCheck,
                keyId: PIE.key_id,
                phase: PIE.phase.toString(),
            };
        } catch (e) {
            throw new Error('Failed to encrypt walmart');
        }
    }

    private async fetchPIE(): Promise<PIE> {
        try {
            const key_url = KEY_URL + this.timestamp;
            const res = await axios.get(key_url);
            const PIE = {} as PIE;

            for (const key of Object.keys(PIE)) {
                const reg = new RegExp(`PIE.${key} = (.*?);`);
                const match = reg.exec(res.data);

                if (!match) throw new Error('Error fetching PIE');

                PIE[key] = JSON.parse(match[1]);
            }

            return PIE;
        } catch (e) {
            throw new Error(e);
        }
    }

    private get timestamp(): string {
        return new Date().getTime().toString();
    }
}
