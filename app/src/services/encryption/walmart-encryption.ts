import { CreditCard } from '@core/credit-card';
import { debug } from '@core/log';
import { EncryptWalmart } from '@core/walmart/scripts/WalmartClientEncryption';
import { WalmartCreditCard } from '@interfaces/TaskInterfaces';
import axios from 'axios';
const log = debug.extend('walmart-encryption-service');

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

enum PIE_KEYS {
    L = 'L',
    E = 'E',
    K = 'K',
    key_id = 'key_id',
    phase = 'phase',
}
type EncryptFunction = (number: string, cvc: string, format: boolean, PIE: PIE) => string[];

const KEY_URL = 'https://securedataweb.walmart.com/pie/v1/wmcom_us_vtg_pie/getkey.js?bust=';
export class WalmartEncryption {
    // private walmartEncrypt: EncryptFunction;

    async encrypt(plainCC: CreditCard): Promise<WalmartCreditCard> {
        try {
            log('Starting encryption');
            const PIE = await this.fetchPIE();
            log('Got PIE keys %o', PIE);

            const [encryptedNumber, encryptedCVC, integrityCheck] = EncryptWalmart(plainCC.number, plainCC.cvc, true, PIE);

            log('Encryption successful %s %s %s', encryptedNumber, encryptedCVC, integrityCheck);

            return {
                ...plainCC,
                number: encryptedNumber,
                cvc: encryptedCVC,
                integrityCheck: integrityCheck,
                keyId: PIE.key_id,
                phase: PIE.phase.toString(),
            };
        } catch (e) {
            log('Error in walmart encryption %s', e);
            throw new Error('Failed to encrypt walmart');
        }
    }

    private async fetchPIE(): Promise<PIE> {
        try {
            const key_url = KEY_URL + this.timestamp;
            const res = await axios.get(key_url);

            const PIE = {} as PIE;

            for (const key in PIE_KEYS) {
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
