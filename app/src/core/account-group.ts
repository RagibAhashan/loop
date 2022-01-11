import { AccountStoreType } from '../constants/stores';
import { Account } from './account';
import { debug } from './log';
import { AccountViewData } from './models/account';
import { Viewable } from './viewable';

const log = debug.extend('AccountGroup');

export const accountGroupPrefix = 'accgrp';

export interface AccountGroupViewData {
    id: string;
    name: string;
    storeType: AccountStoreType;
    accounts: AccountViewData[];
}

export interface IAccountGroup {
    id: string;
    name: string;
    storeType: AccountStoreType;
    // add methods if necessary
}

export type AccountMap = Map<string, Account>;

export class AccountGroup implements IAccountGroup, Viewable<AccountGroupViewData> {
    id: string;
    name: string;
    storeType: AccountStoreType;
    accounts: AccountMap;

    constructor(id: string, name: string, storeType: AccountStoreType) {
        this.id = id;
        this.name = name;
        this.storeType = storeType;
        this.accounts = new Map();
    }

    public getViewData(): AccountGroupViewData {
        return {
            id: this.id,
            name: this.name,
            storeType: this.storeType,
            accounts: this.getAllAccountsViewData(),
        };
    }

    public addAccount(account: Account): void {
        //Should never happen
        if (this.accounts.has(account.id)) {
            log('Account already exists, could not add account %s %s', account.id, this.storeType);
            return;
        }

        this.accounts.set(account.id, account);
    }

    public removeAccount(id: string): void {
        if (this.accounts.has(id)) {
            this.accounts.delete(id);
        }
    }

    public removeAllAccounts(): void {
        this.accounts = new Map();
    }

    public getAllAccountsViewData(): AccountViewData[] {
        const accounts: AccountViewData[] = [];
        this.accounts.forEach((account) => accounts.push(account.getViewData()));
        return accounts;
    }

    public getAccountViewData(id: string): AccountViewData {
        const account = this.getAccount(id);
        return account.getViewData();
    }

    public getAllAccounts(): Account[] {
        return Array.from(this.accounts.values());
    }

    public getAccount(id: string): Account {
        const account = this.accounts.get(id);
        if (!account) throw new Error('getAccount: Cound not be found key');
        return account;
    }

    public async logIn(id: string): Promise<void> {
        const account = this.getAccount(id);
        await account.logIn();
    }

    public logOut(id: string): void {
        const account = this.getAccount(id);
        account.logOut();
    }

    public editName(newName: string): void {
        this.name = newName;
    }
}
