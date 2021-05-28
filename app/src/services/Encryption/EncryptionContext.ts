import { CreditCard } from './../../core/interface/UserProfile';
import { EncryptionStrategy } from './EncryptionStrategy';
import { FootlockerEncryption } from './FootlockerEncryption';

class EncryptionContext {
    private encryptionStrategy: EncryptionStrategy;

    constructor(encryptionStrategy: EncryptionStrategy) {
        this.encryptionStrategy = encryptionStrategy;
    }

    public setEncryptionStrategy(encStrat: EncryptionStrategy): void {
        this.encryptionStrategy = encStrat;
    }

    public async encrypt(plainCC: CreditCard): Promise<CreditCard> {
        try {
            return this.encryptionStrategy.encrypt(plainCC);
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default new EncryptionContext(new FootlockerEncryption()); // by default just select footlocker encryption
