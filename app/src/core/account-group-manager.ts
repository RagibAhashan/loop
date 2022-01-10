import { ipcMain } from 'electron';
import { AccountStoreType } from '../constants/stores';
import { Account, AccountFormData, AccountViewData, IAccount } from './account';
import { AccountFactory } from './account-factory';
import { AccountGroup, AccountGroupViewData, IAccountGroup } from './account-group';
import { AccountGroupFactory } from './account-group-factory';
import { AppDatabase } from './app-database';
import { AccountGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { TaskGroupManager } from './taskgroup-manager';

const log = debug.extend('AccountGroupManager');
export type AccountGroupMap = Map<string, AccountGroup>;

export class AccountGroupManager extends Manager {
    private accountGroupMap: AccountGroupMap;
    private accountGroupFactory: AccountGroupFactory;
    private accountFactory: AccountFactory;
    private taskGroupManager: TaskGroupManager;

    constructor(database: AppDatabase, accountGroupFactory: AccountGroupFactory, accountFactory: AccountFactory, taskGroupManager: TaskGroupManager) {
        super(database);
        this.accountGroupMap = new Map();
        this.accountGroupFactory = accountGroupFactory;
        this.accountFactory = accountFactory;
        this.taskGroupManager = taskGroupManager;
    }

    protected async loadFromDB(): Promise<void> {
        const accountGroups = await this.database.loadModelDB<IAccountGroup[]>('AccountGroup');
        const accounts = await this.database.loadModelDB<IAccount[]>('Account');

        if (!accountGroups || !accounts) return;

        for (const accountGroup of accountGroups) {
            this.addAccountGroup(accountGroup.id, accountGroup.name, accountGroup.storeType);

            // TODO Review this logic
            const accountDatas: AccountFormData[] = [];

            accounts.forEach((account) => {
                if (account.groupId === accountGroup.id) {
                    accountDatas.push(this.accountInterfaceToFormData(account));
                }
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

        const accountGroup = this.getAccountGroup(groupId);

        accountGroup.getAllAccounts().forEach((account) => {
            const taskId = account.taskId;
            // If account is associated with task, then remove relation
            if (taskId) {
                const task = this.taskGroupManager.getTaskGroup(taskId.groupId).getTask(taskId.id);
                task.account = null;
            }
        });

        this.accountGroupMap.delete(groupId);

        return this.getAllAccountGroupsViewData();
    }

    public getAccountGroup(groupId: string): AccountGroup {
        const accountGroup = this.accountGroupMap.get(groupId);

        if (!accountGroup) throw new Error('getAccountGroup: Could not get key');

        return accountGroup;
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

    private addAccountToGroup(groupId: string, taskDatas: AccountFormData[]): AccountViewData[] {
        const accountGroup = this.getAccountGroup(groupId);

        for (const accountData of taskDatas) {
            const newAccount = this.accountFactory.createAccount(accountData, groupId);
            accountGroup.addAccount(newAccount);
        }

        return accountGroup.getAllAccountsViewData();
    }

    private removeAccountFromGroup(groupId: string, accountIds: string[]): AccountViewData[] | null {
        const accountGroup = this.getAccountGroup(groupId);

        for (const id of accountIds) {
            const taskId = accountGroup.getAccount(id).taskId;

            if (taskId) {
                const task = this.taskGroupManager.getTaskGroup(taskId.groupId).getTask(taskId.id);
                task.account = null;
            }

            accountGroup.removeAccount(id);
        }

        return accountGroup.getAllAccountsViewData();
    }

    private removeAllAccountsFromGroup(groupId: string): AccountViewData[] {
        const accountGroup = this.getAccountGroup(groupId);

        accountGroup.getAllAccounts().forEach((account) => {
            const taskId = account.taskId;

            if (taskId) {
                const task = this.taskGroupManager.getTaskGroup(taskId.groupId).getTask(taskId.id);
                task.account = null;
            }
        });

        accountGroup.removeAllAccounts();

        return accountGroup.getAllAccountsViewData();
    }

    private editAccountGroupName(groupId: string, newName: string): AccountGroupViewData[] | null {
        const accountGroup = this.accountGroupMap.get(groupId);

        if (!accountGroup) return null;

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

        ipcMain.handle(AccountGroupChannel.getAccountFromAccountGroup, (event, groupId: string, accountId: string): AccountViewData => {
            const currentAccountGroup = this.getAccountGroup(groupId);
            const account = currentAccountGroup.getAccountViewData(accountId);
            return account;
        });

        ipcMain.on(AccountGroupChannel.addAccountToGroup, (event, groupId: string, accounts: AccountFormData[]) => {
            const taskList = this.addAccountToGroup(groupId, accounts);

            if (taskList) {
                event.reply(AccountGroupChannel.accountsUpdated, taskList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });

        ipcMain.on(AccountGroupChannel.removeAccountFromGroup, (event, groupId: string, accountIds: string[]) => {
            const taskList = this.removeAccountFromGroup(groupId, accountIds);
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
