import { ipcMain } from 'electron';
import { AccountStoreType } from '../constants/stores';
import { AccountGroup, AccountGroupViewData } from './account-group';
import { AccountGroupStore } from './account-group-store';
import { AccountGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { AccountFormData, AccountViewData } from './models/account';
import { SettingsStore } from './settings-store';
import { TaskGroupStore } from './task-group-store';

const log = debug.extend('AccountGroupManager');
export type AccountGroupMap = Map<string, AccountGroup>;

export class AccountGroupManager extends Manager {
    private accountGroupMap: AccountGroupMap;
    private accountGroupStore: AccountGroupStore;
    private settingsStore: SettingsStore;
    private taskGroupStore: TaskGroupStore;

    constructor(accountGroupStore: AccountGroupStore, settingsStore: SettingsStore, taskGroupStore: TaskGroupStore) {
        super();
        this.accountGroupStore = accountGroupStore;
        this.settingsStore = settingsStore;
        this.taskGroupStore = taskGroupStore;
    }

    protected async loadFromDB(): Promise<void> {
        await this.accountGroupStore.loadFromDB();
    }

    private editAccountGroupName(groupId: string, newName: string): AccountGroupViewData[] | null {
        const accountGroup = this.accountGroupMap.get(groupId);

        if (!accountGroup) return null;

        accountGroup.editName(newName);

        return this.accountGroupStore.getAllAccountGroupsViewData();
    }

    protected registerListeners(): void {
        ipcMain.handle(AccountGroupChannel.getAccountGroups, (_): AccountGroupViewData[] => {
            return this.accountGroupStore.getAllAccountGroupsViewData();
        });

        ipcMain.on(AccountGroupChannel.addAccountGroup, (event, id: string, name: string, storeType: AccountStoreType) => {
            const accountGroups = this.accountGroupStore.addAccountGroup(id, name, storeType);
            if (accountGroups) {
                event.reply(AccountGroupChannel.accountGroupsUpdated, accountGroups);
            } else {
                event.reply(AccountGroupChannel.accountGroupError);
            }
        });

        ipcMain.on(AccountGroupChannel.removeAccountGroup, (event, groupId: string) => {
            const accountGroup = this.accountGroupStore.getAccountGroup(groupId);

            accountGroup.getAllAccounts().forEach((account) => {
                const taskId = account.taskId;
                // If account is associated with task, then remove relation
                if (taskId) {
                    const task = this.taskGroupStore.getTaskGroup(taskId.groupId).getTask(taskId.id);
                    task.account = null;
                }
            });

            const accountGroups = this.accountGroupStore.removeAccountGroup(groupId);
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
            const currentAccountGroup = this.accountGroupStore.getAccountGroup(groupId);
            if (currentAccountGroup) {
                const accounts = currentAccountGroup.getAllAccountsViewData();
                event.reply(AccountGroupChannel.onAccountGroupSelected, currentAccountGroup.getViewData(), accounts);
            }
        });

        ipcMain.handle(AccountGroupChannel.getAccountFromAccountGroup, (event, groupId: string, accountId: string): AccountViewData => {
            const currentAccountGroup = this.accountGroupStore.getAccountGroup(groupId);
            const account = currentAccountGroup.getAccountViewData(accountId);
            return account;
        });

        ipcMain.on(AccountGroupChannel.addAccountToGroup, (event, groupId: string, accountDatas: AccountFormData[]) => {
            const accountList = this.accountGroupStore.addAccountToGroup(groupId, accountDatas);

            if (accountList) {
                event.reply(AccountGroupChannel.accountsUpdated, accountList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });

        ipcMain.on(AccountGroupChannel.removeAccountFromGroup, (event, groupId: string, accountIds: string[]) => {
            const accountGroup = this.accountGroupStore.getAccountGroup(groupId);

            for (const accountId of accountIds) {
                const taskId = accountGroup.getAccount(accountId).taskId;

                if (taskId) {
                    const task = this.taskGroupStore.getTaskGroup(taskId.groupId).getTask(taskId.id);
                    task.account = null;
                }
            }

            const accountList = this.accountGroupStore.removeAccountFromGroup(groupId, accountIds);

            if (accountList) {
                event.reply(AccountGroupChannel.accountsUpdated, accountList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });

        ipcMain.on(AccountGroupChannel.removeAllAccountsFromGroup, (event, groupId: string) => {
            const accountGroup = this.accountGroupStore.getAccountGroup(groupId);

            accountGroup.getAllAccounts().forEach((account) => {
                const taskId = account.taskId;

                if (taskId) {
                    const task = this.taskGroupStore.getTaskGroup(taskId.groupId).getTask(taskId.id);
                    task.account = null;
                }
            });

            const accountList = this.accountGroupStore.removeAllAccountsFromGroup(groupId);
            if (accountList) {
                event.reply(AccountGroupChannel.accountsUpdated, accountList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });

        ipcMain.on(AccountGroupChannel.logIn, async (event, groupId: string, accountId: string) => {
            const accountGroup = this.accountGroupStore.getAccountGroup(groupId);

            await accountGroup.logIn(accountId);

            event.reply(AccountGroupChannel.accountsUpdated, this.accountGroupStore.getAllAccountsViewData());
        });

        ipcMain.on(AccountGroupChannel.logOut, (event, groupId: string, accountId: string) => {
            const accountGroup = this.accountGroupStore.getAccountGroup(groupId);

            accountGroup.logOut(accountId);

            event.reply(AccountGroupChannel.accountsUpdated, this.accountGroupStore.getAllAccountsViewData());
        });
    }
}
