import { CreditCardFactory } from './credit-card-factory';
import { debug } from './log';
import { Profile, ProfileFormData } from './profile';

const log = debug.extend('ProfileFactory');

export class ProfileFactory {
    private creditCardFactory: CreditCardFactory;

    constructor(creditCardFactory: CreditCardFactory) {
        this.creditCardFactory = creditCardFactory;
    }
    public createProfile(groupName: string, profileData: ProfileFormData): Profile {
        // expiryMonth: string, expiryYear: string, cvc: string, cardHolderName: string
        const cc = this.creditCardFactory.createCreditCard(profileData.payment);

        const profile = new Profile(
            profileData.id,
            profileData.name,
            groupName,
            profileData.billing,
            profileData.shipping,
            cc,
            this.creditCardFactory,
        );

        log('Profile created');
        return profile;
    }
}
