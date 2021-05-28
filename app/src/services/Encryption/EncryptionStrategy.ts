import { CreditCard } from './../../core/interface/UserProfile';

export interface EncryptionStrategy {
    encrypt(plainCC: CreditCard): Promise<CreditCard>;
}
