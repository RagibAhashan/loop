import { CreditCardFactory } from './credit-card-factory';
import { debug } from './log';
import { Profile, ProfileFormData } from './profile';

const log = debug.extend('ProfileFactory');

export class ProfileFactory {
    private creditCardFactory: CreditCardFactory;

    constructor(creditCardFactory: CreditCardFactory) {
        this.creditCardFactory = creditCardFactory;
    }
    public createProfile(groupName: string, profile: ProfileFormData): Profile {
        // expiryMonth: string, expiryYear: string, cvc: string, cardHolderName: string
        const cc = this.creditCardFactory.createCreditCard(profile.payment);

        const newProfile = new Profile(profile.id, profile.name, groupName, profile.billing, profile.shipping, cc, this.creditCardFactory);

        log('Profile created');
        return newProfile;
    }
}
