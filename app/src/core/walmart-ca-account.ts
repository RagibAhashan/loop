import { Account } from './account';
import { AccountStatus } from './models/account';
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
        this.emitStatus('info', 'Opening browser...');

        const browser = await this.openLoginPage();

        this.emitStatus('info', 'Waiting for login');

        await new Promise((r) => setTimeout(r, 10000));

        this.loggedIn = true;

        this.emitStatus('success', 'Logged in');

        browser.close();
    }
}
