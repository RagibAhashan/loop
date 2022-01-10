import { Account } from './account';
import { Settings } from './settings';

export class WalmartCAAccount extends Account {
    constructor(id: string, groupId: string, name: string, email: string, password: string, loginProxy: string, settings: Settings) {
        super(id, groupId, name, email, password, loginProxy, settings);
        this.logInPage = 'https://www.walmart.ca/sign-in';
    }
    public logIn(): void {}
}
