import { CreditCardFactory } from './CreditCardFactory';
import { debug } from './Log';
import { Profile, ProfileFormData } from './Profile';

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
            profileData.profileName,
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
