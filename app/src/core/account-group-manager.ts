import { ipcMain } from 'electron';
import { AccountStoreType } from '../constants/stores';
import { AccountGroup, AccountGroupViewData } from './account-group';
import { AccountGroupStore } from './account-group-store';
import { AccountGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { AccountFormData, AccountViewData, IAccount } from './models/account';
import { SettingsStore } from './settings-store';

const log = debug.extend('AccountGroupManager');
export type AccountGroupMap = Map<string, AccountGroup>;

export class AccountGroupManager extends Manager {
    private accountGroupMap: AccountGroupMap;
    private accountGroupStore: AccountGroupStore;
    private settingsStore: SettingsStore;

    constructor(accountGroupStore: AccountGroupStore, settingsStore: SettingsStore) {
        super();
        this.accountGroupStore = accountGroupStore;
        this.settingsStore = settingsStore;
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
            const accounts = accountDatas.map((accountData) => {
                const account: IAccount = {
                    email: accountData.email,
                    groupId: groupId,
                    id: accountData.id,
                    logInPage: '',
                    loggedIn: false,
                    loginProxy: accountData.loginProxy,
                    name: accountData.name,
                    password: accountData.password,
                    settings: this.settingsStore.getSettings(),
                    taskId: null,
                    status: { message: 'Ready', level: 'info' },
                };

                return account;
            });

            const accountList = this.accountGroupStore.addAccountToGroup(groupId, accounts);

            if (accountList) {
                event.reply(AccountGroupChannel.accountsUpdated, accountList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });

        ipcMain.on(AccountGroupChannel.removeAccountFromGroup, (event, groupId: string, accountIds: string[]) => {
            const accountList = this.accountGroupStore.removeAccountFromGroup(groupId, accountIds);
            if (accountList) {
                event.reply(AccountGroupChannel.accountsUpdated, accountList);
            } else {
                event.reply(AccountGroupChannel.accountGroupError, 'Error');
            }
        });

        ipcMain.on(AccountGroupChannel.removeAllAccountsFromGroup, (event, groupId: string) => {
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
