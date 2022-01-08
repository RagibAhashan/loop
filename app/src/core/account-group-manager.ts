import { ipcMain } from 'electron';
import { AccountStoreType } from '../constants/stores';
import { Account, AccountViewData, IAccount } from './account';
import { AccountFactory } from './account-factory';
import { AccountGroup, AccountGroupViewData } from './account-group';
import { AccountGroupFactory } from './account-group-factory';
import { AppDatabase } from './app-database';
import { AccountGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { TaskFormData } from './task';

const log = debug.extend('AccountGroupManager');
export type AccountGroupMap = Map<string, AccountGroup>;

export class AccountGroupManager extends Manager {
    private accountGroupMap: AccountGroupMap;
    private accountGroupFactory: AccountGroupFactory;
    private accountFactory: AccountFactory;

    constructor(database: AppDatabase, accountGroupFactory: AccountGroupFactory, accountFactory: AccountFactory) {
        super(database);
        this.accountGroupMap = new Map();
        this.accountGroupFactory = accountGroupFactory;
        this.accountFactory = accountFactory;
    }

    protected async loadFromDB(): Promise<void> {
        const accountGroups = await this.database.loadModelDB<AccountGroup[]>('AccountGroup');
        const accounts = await this.database.loadModelDB<Account[]>('Account');

        if (!accountGroups || !accounts) return;

        for (const accountGroup of accountGroups) {
            this.addAccountGroup(accountGroup.id, accountGroup.name, accountGroup.storeType);

            // TODO Review this logic
            const accountDatas: IAccount[] = [];

            accounts.forEach((account) => {
                if (account.groupId === accountGroup.id) accountDatas.push(account);
            });

            this.addTaskToGroup(accountGroup.name, accountDatas);
        }

        log('AccountGroup Loaded');
    }

    public async saveToDB(): Promise<boolean> {
        const agSaved = await this.database.saveModelDB<AccountGroup[]>('AccountGroup', this.getAllAccountGroups());
        const aSaved = await this.database.saveModelDB<Account[]>('Account', this.getAllAccounts());

        if (!agSaved || aSaved) return false;

        log('AccountGroups Saved to DB!');
        return true;
    }

    private addAccountGroup(id: string, name: string, storeType: AccountStoreType): AccountGroupViewData[] | null {
        if (this.accountGroupMap.has(name)) {
            log('[Group %s already exists]', name);
            return null;
        }

        const newGroup = this.accountGroupFactory.createAccountGroup(id, name, storeType);

        this.accountGroupMap.set(id, newGroup);

        return this.getAllAccountGroupsViewData();
    }

    private removeAccountGroup(groupId: string): AccountGroupViewData[] | null {
        if (!this.accountGroupMap.has(groupId)) {
            log('[Group not found]');
            return null;
        }
        this.accountGroupMap.delete(groupId);

        return this.getAllAccountGroupsViewData();
    }

    private getAccountGroup(groupId: string): AccountGroup | undefined {
        return this.accountGroupMap.get(groupId);
    }

    private getAllAccountGroupsViewData(): AccountGroupViewData[] {
        const accountGroups: AccountGroupViewData[] = [];
        this.accountGroupMap.forEach((accountGroup) => accountGroups.push(accountGroup.getViewData()));
        return accountGroups;
    }

    private getAllAccountGroups(): AccountGroup[] {
        return Array.from(this.accountGroupMap.values());
    }

    private getAllAccounts(): Account[] {
        const accounts: Account[] = [];
        this.accountGroupMap.forEach((accountGroup) => accounts.push(...accountGroup.getAllAccounts()));
        return accounts;
    }

    private addTaskToGroup(groupId: string, taskDatas: Partial<Account>[]): AccountViewData[] | null {
        if (!this.accountGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const accountGroup = this.accountGroupMap.get(groupId);

        for (const accountData of taskDatas) {
            const newAccount = this.accountFactory.createAccount(accountData, groupId);
            accountGroup.addAccount(newAccount);
        }

        return accountGroup.getAllAccountsViewData();
    }

    private removeTaskFromGroup(groupId: string, accountIds: string[]): AccountViewData[] | null {
        if (!this.accountGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }
        const accountGroup = this.accountGroupMap.get(groupId);

        for (const id of accountIds) {
            accountGroup.removeAccount(id);
        }

        return accountGroup.getAllAccountsViewData();
    }

    private removeAllAccountsFromGroup(groupId: string): AccountViewData[] | null {
        if (!this.accountGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const accountGroup = this.accountGroupMap.get(groupId);

        accountGroup.removeAllAccounts();

        return accountGroup.getAllAccountsViewData();
    }

    private editAccountGroupName(groupId: string, newName: string): AccountGroupViewData[] {
        const accountGroup = this.accountGroupMap.get(groupId);

        accountGroup.editName(newName);

        return this.getAllAccountGroupsViewData();
    }

    protected registerListeners(): void {
        ipcMain.handle(AccountGroupChannel.getAccountGroups, (_): AccountGroupViewData[] => {
            return this.getAllAccountGroupsViewData();
        });

        ipcMain.on(AccountGroupChannel.addAccountGroup, (event, id: string, name: string, storeType: AccountStoreType) => {
            const accountGroups = this.addAccountGroup(id, name, storeType);
            if (accountGroups) {
                event.reply(AccountGroupChannel.accountGroupsUpdated, accountGroups);
            } else {
                event.reply(AccountGroupChannel.accountGroupError);
            }
        });

        ipcMain.on(AccountGroupChannel.removeAccountGroup, (event, groupId: string) => {
            const accountGroups = this.removeAccountGroup(groupId);
            if (accountGroups) {
                event.reply(AccountGroupChannel.accountGroupsUpdated, accountGroups);
            } else {
                event.reply(AccountGroupChannel.accountGroupError);
            }
        });

        ipcMain.on(AccountGroupChannel.editAccountGroupName, (event, groupId: string, newName: string) => {
            const accountGroup = this.editAccountGroupName(groupId, newName);

            if (accountGroup) {
                event.reply(AccountGroupChannel.accountGroupsUpdated, accountGroup);
            } else {
                event.reply(AccountGroupChannel.accountGroupError);
            }
        });

        ipcMain.on(AccountGroupChannel.getAllAccountsFromGroup, (event, groupId: string) => {
            const currentAccountGroup = this.getAccountGroup(groupId);
            if (currentAccountGroup) {
                const accounts = currentAccountGroup.getAllAccountsViewData();
                event.reply(AccountGroupChannel.onAccountGroupSelected, currentAccountGroup.getViewData(), accounts);
            }
        });

        ipcMain.handle(AccountGroupChannel.getAccountFromAccountGroup, (event, groupId: string, uuid: string): AccountViewData => {
            const currentAccountGroup = this.getAccountGroup(groupId);
            if (currentAccountGroup) {
                const task = currentAccountGroup.getAccountViewData(uuid);
                return task;
            }
        });

        ipcMain.on(AccountGroupChannel.addAccountToGroup, (event, groupId: string, accounts: TaskFormData[]) => {
            const taskList = this.addTaskToGroup(groupId, accounts);

            if (taskList) {
                event.reply(AccountGroupChannel.accountsUpdated, taskList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });

        ipcMain.on(AccountGroupChannel.removeAccountFromGroup, (event, groupId: string, uuids: string[]) => {
            const taskList = this.removeTaskFromGroup(groupId, uuids);
            if (taskList) {
                event.reply(AccountGroupChannel.accountsUpdated, taskList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });

        ipcMain.on(AccountGroupChannel.removeAllAccountsFromGroup, (event, groupId: string) => {
            const accountList = this.removeAllAccountsFromGroup(groupId);
            if (accountList) {
                event.reply(AccountGroupChannel.accountsUpdated, accountList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });
    }
}
