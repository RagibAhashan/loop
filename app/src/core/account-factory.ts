import { BrowserWindow } from 'electron';
import { Account } from './account';
import { debug } from './log';
import { AccountEmittedEvents, AccountFormData, AccountStatus } from './models/account';
import { SettingsStore } from './settings-store';
import { WalmartCAAccount } from './walmart-ca-account';

const log = debug.extend('AccountFactory');

export class AccountFactory {
    private mainWindow: BrowserWindow;
    private settingsStore: SettingsStore;

    constructor(mainWindow: BrowserWindow, settingsStore: SettingsStore) {
        this.mainWindow = mainWindow;
        this.settingsStore = settingsStore;
    }

    public createAccount(groupId: string, accountData: AccountFormData): Account {
        const settings = this.settingsStore.getSettings();

        const newAccount = new WalmartCAAccount(
            accountData.id,
            groupId,
            accountData.name,
            accountData.email,
            accountData.password,
            accountData.loginProxy,
            settings,
            { message: 'Ready', level: 'info' },
        );

        newAccount.on(AccountEmittedEvents.Status, (status: AccountStatus) => {
            this.mainWindow.webContents.send(AccountEmittedEvents.Status + newAccount.id, status);
        });

        return newAccount;
    }
}
