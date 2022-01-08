import { AccountStoreType } from '../constants/stores';
import { AccountGroup } from './account-group';
import { debug } from './log';

const log = debug.extend('AccountGroupFactory');

export class AccountGroupFactory {
    constructor() {}

    public createAccountGroup(id: string, name: string, storeType: AccountStoreType): AccountGroup {
        const accountGroup = new AccountGroup(id, name, storeType);
        return accountGroup;
    }
}
