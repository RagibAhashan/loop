import { Account } from './account';
import { debug } from './log';
import { SettingsManager } from './settings-manager';
import { WalmartCAAccount } from './walmart-ca-account';

const log = debug.extend('AccountFactory');
export class AccountFactory {
    private settingsManager: SettingsManager;

    constructor(settingsManager: SettingsManager) {
        this.settingsManager = settingsManager;
    }
    public createAccount(accountData: Partial<Account>, groupId: string): Account {
        const settings = this.settingsManager.getSettings();
        const account = new WalmartCAAccount(accountData.id, groupId, accountData.name, accountData.email, accountData.password, settings);

        return account;
    }
}
