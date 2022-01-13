import { AccountStoreType } from '@constants/stores';
import { BrowserWindow } from 'electron';
import { Account } from './account';
import { debug } from './log';
import { AccountEmittedEvents, AccountFormData, AccountStatus } from './models/account';
import { SettingsStore } from './settings-store';
import { WalmartCAAccount } from './walmart/walmart-ca-account';

const log = debug.extend('AccountFactory');

export class AccountFactory {
    private mainWindow: BrowserWindow;
    private settingsStore: SettingsStore;

    constructor(mainWindow: BrowserWindow, settingsStore: SettingsStore) {
        this.mainWindow = mainWindow;
        this.settingsStore = settingsStore;
    }

    public createAccount(groupId: string, storeType: AccountStoreType, accountData: AccountFormData): Account {
        const settings = this.settingsStore.getSettings();

        let newAccount;

        switch (storeType) {
            case AccountStoreType.Amazon:
                throw new Error('Account not yet implemented');
            case AccountStoreType.WalmartCA:
                newAccount = new WalmartCAAccount(
                    accountData.id,
                    groupId,
                    accountData.name,
                    accountData.email,
                    accountData.password,
                    accountData.loginProxy,
                    settings,
                    { message: 'Waiting for login', level: 'info' },
                );
                break;
            case AccountStoreType.WalmartUS:
                throw new Error('Account not yet implemented');
        }

        newAccount.on(AccountEmittedEvents.Status, (status: AccountStatus) => {
            this.mainWindow.webContents.send(AccountEmittedEvents.Status + newAccount.id, status);
        });

        return newAccount;
    }
}
