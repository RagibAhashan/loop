import { Account } from '../account';
import { AccountStatus } from '../models/account';
import { Settings } from '../settings';

export class WalmartUSAccount extends Account {
    constructor(
        id: string,
        groupId: string,
        name: string,
        email: string,
        password: string,
        loginProxy: string,
        settings: Settings,
        status: AccountStatus,
    ) {
        super(id, groupId, name, email, password, loginProxy, settings, status);
        this.logInPage = 'https://www.walmart.com';
    }
}
