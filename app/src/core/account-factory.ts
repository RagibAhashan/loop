import { BrowserWindow } from 'electron';
import { Account } from './account';
import { debug } from './log';
import { AccountEmittedEvents, AccountStatus, IAccount } from './models/account';
import { WalmartCAAccount } from './walmart-ca-account';

const log = debug.extend('AccountFactory');

export class AccountFactory {
    private mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    public createAccount(groupId: string, account: IAccount): Account {
        const newAccount = new WalmartCAAccount(
            account.id,
            groupId,
            account.name,
            account.email,
            account.password,
            account.loginProxy,
            account.settings,
            account.status,
        );

        newAccount.on(AccountEmittedEvents.Status, (status: AccountStatus) => {
            this.mainWindow.webContents.send(AccountEmittedEvents.Status + account.id, status);
        });

        return newAccount;
    }
}
