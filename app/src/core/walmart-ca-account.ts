import { Account } from './account';
import { AccountEmittedEvents, AccountStatus } from './models/account';
import { Settings } from './settings';

export class WalmartCAAccount extends Account {
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
        this.logInPage = 'https://www.walmart.ca/sign-in';
    }

    public async logIn(): Promise<void> {
        this.emit(AccountEmittedEvents.Status, { level: 'info', message: 'Opening browser...' } as AccountStatus);

        const browser = await this.openLoginPage();

        this.emit(AccountEmittedEvents.Status, { level: 'info', message: 'Waiting for login' } as AccountStatus);

        await new Promise((r) => setTimeout(r, 2000));

        this.loggedIn = true;

        browser.close();
    }
}
