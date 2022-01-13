import { AccountStoreType } from '@constants/stores';
import { Account } from './account';
import { AccountFactory } from './account-factory';
import { AccountGroup, AccountGroupViewData, IAccountGroup } from './account-group';
import { AccountGroupFactory } from './account-group-factory';
import { AppDatabase } from './app-database';
import { debug } from './log';
import { AccountFormData, AccountViewData, IAccount } from './models/account';

const log = debug.extend('AccountGroupStore');
export type AccountGroupMap = Map<string, AccountGroup>;

export class AccountGroupStore {
    private accountGroupMap: AccountGroupMap;
    private accountGroupFactory: AccountGroupFactory;
    private accountFactory: AccountFactory;
    private database: AppDatabase;

    constructor(database: AppDatabase, accountGroupFactory: AccountGroupFactory, accountFactory: AccountFactory) {
        this.accountGroupMap = new Map();
        this.accountGroupFactory = accountGroupFactory;
        this.accountFactory = accountFactory;
        this.database = database;
    }

    public async loadFromDB(): Promise<void> {
        const accountGroups = await this.database.loadModelDB<IAccountGroup[]>('AccountGroup');
        const accounts = await this.database.loadModelDB<IAccount[]>('Account');

        if (!accountGroups || !accounts) return;

        for (const accountGroup of accountGroups) {
            this.addAccountGroup(accountGroup.id, accountGroup.name, accountGroup.storeType);

            // TODO review this logic
            const accountDatas: AccountFormData[] = [];

            accounts.forEach((account) => {
                const accountFormData = this.accountInterfaceToFormData(account);
                if (account.groupId === accountGroup.id) accountDatas.push(accountFormData);
            });

            this.addAccountToGroup(accountGroup.id, accountDatas);
        }

        log('AccountGroup Loaded');
    }

    private accountInterfaceToFormData(account: IAccount): AccountFormData {
        return {
            id: account.id,
            loginProxy: account.loginProxy,
            email: account.email,
            name: account.name,
            password: account.password,
        };
    }

    public async saveToDB(): Promise<boolean> {
        const agSaved = await this.database.saveModelDB<IAccountGroup[]>('AccountGroup', this.getAllAccountGroups());
        const aSaved = await this.database.saveModelDB<IAccount[]>('Account', this.getAllAccounts());

        if (!agSaved || aSaved) return false;

        log('AccountGroups Saved to DB!');
        return true;
    }

    public addAccountGroup(id: string, name: string, storeType: AccountStoreType): AccountGroupViewData[] | null {
        if (this.accountGroupMap.has(name)) {
            log('[Group %s already exists]', name);
            return null;
        }

        const newGroup = this.accountGroupFactory.createAccountGroup(id, name, storeType);

        this.accountGroupMap.set(id, newGroup);

        return this.getAllAccountGroupsViewData();
    }

    public removeAccountGroup(groupId: string): AccountGroupViewData[] | null {
        if (!this.accountGroupMap.has(groupId)) {
            log('[Group not found]');
            return null;
        }

        this.accountGroupMap.delete(groupId);

        return this.getAllAccountGroupsViewData();
    }

    public getAccountGroup(groupId: string): AccountGroup {
        const accountGroup = this.accountGroupMap.get(groupId);

        if (!accountGroup) throw new Error('getAccountGroup: Could not get key');

        return accountGroup;
    }

    public getAllAccountGroupsViewData(): AccountGroupViewData[] {
        const accountGroups: AccountGroupViewData[] = [];
        this.accountGroupMap.forEach((accountGroup) => accountGroups.push(accountGroup.getViewData()));
        return accountGroups;
    }

    public getAllAccountGroups(): AccountGroup[] {
        return Array.from(this.accountGroupMap.values());
    }

    public getAllAccounts(): Account[] {
        const accounts: Account[] = [];
        this.accountGroupMap.forEach((accountGroup) => accounts.push(...accountGroup.getAllAccounts()));
        return accounts;
    }

    public getAllAccountsViewData(): AccountViewData[] {
        const accounts: AccountViewData[] = [];
        this.accountGroupMap.forEach((accountGroup) => accounts.push(...accountGroup.getAllAccountsViewData()));
        return accounts;
    }

    public addAccountToGroup(groupId: string, accountDatas: AccountFormData[]): AccountViewData[] {
        const accountGroup = this.getAccountGroup(groupId);

        for (const accountData of accountDatas) {
            const newAccount = this.accountFactory.createAccount(groupId, accountGroup.storeType, accountData);
            accountGroup.addAccount(newAccount);
        }

        return accountGroup.getAllAccountsViewData();
    }

    public removeAccountFromGroup(groupId: string, accountIds: string[]): AccountViewData[] | null {
        const accountGroup = this.getAccountGroup(groupId);

        for (const id of accountIds) {
            accountGroup.removeAccount(id);
        }

        return accountGroup.getAllAccountsViewData();
    }

    public removeAllAccountsFromGroup(groupId: string): AccountViewData[] {
        const accountGroup = this.getAccountGroup(groupId);

        accountGroup.removeAllAccounts();

        return accountGroup.getAllAccountsViewData();
    }
}