import { Account } from './account';
import { Settings } from './settings';

export class WalmartCAAccount extends Account {
    constructor(id: string, groupId: string, name: string, email: string, password: string, settings: Settings) {
        super(id, groupId, name, email, password, settings);
        this.logInPage = 'https://www.walmart.ca/sign-in';
    }
    public logIn(): void {}
}
