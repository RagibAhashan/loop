import { EntityId } from '@core/entity-id';
import { Status } from '@core/interfaces/base';
import { Settings } from '@core/settings';

export const accountPrefix = 'acc';

export type AccountStatusLevel = 'error' | 'info' | 'success';
export type AccountStatus = Status<AccountStatusLevel>;

export interface AccountFormData {
    id: string;
    name: string;
    email: string;
    password: string;
    loginProxy: string;
}

export const enum AccountEmittedEvents {
    Status = 'status',
    LoggedIn = 'loggedIn',
}

export interface AccountViewData {
    id: string;
    name: string;
    email: string;
    groupId: string;
    loggedIn: boolean;
    status: AccountStatus;
}

export interface IAccount {
    id: string;
    name: string;
    email: string;
    password: string;
    loggedIn: boolean;
    logInPage: string;
    groupId: string;
    loginProxy: string;
    settings: Settings;
    taskId: EntityId | null;
    status: AccountStatus;
}
