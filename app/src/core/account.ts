import * as puppeteer from 'puppeteer-core';
import { EntityId } from './entity-id';
import { Settings } from './settings';
import { Viewable } from './viewable';

export const accountPrefix = 'acc';

export interface AccountFormData {
    id: string;
    name: string;
    email: string;
    password: string;
    loginProxy: string;
}

export interface AccountViewData {
    id: string;
    name: string;
    email: string;
    groupId: string;
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
    isUsed: boolean;
    taskId: EntityId | null;
}
export abstract class Account implements IAccount, Viewable<AccountViewData> {
    id: string;
    groupId: string;
    name: string;
    email: string;
    password: string;
    loggedIn: boolean;
    logInPage: string;
    loginProxy: string;
    settings: Settings;
    isUsed: boolean;
    taskId: EntityId | null;

    constructor(id: string, groupId: string, name: string, email: string, password: string, loginProxy: string, settings: Settings) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.loggedIn = false;
        this.logInPage = '';
        this.loginProxy = loginProxy;
        this.settings = settings;
        this.groupId = groupId;
        this.isUsed = false;
        this.taskId = null;
    }

    public setTaskId(value: EntityId | null): void {
        this.taskId = value;
    }

    abstract logIn(): void;

    protected async openLoginPage(): Promise<void> {
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null, executablePath: this.settings.browserPath });

        browser.on('disconnected', () => {
            console.log('browser disconnected');
        });
        const page = await browser.newPage();
        await page.goto(this.logInPage);

        console.log('cookies', await page.cookies());
    }
    public getViewData(): AccountViewData {
        return { id: this.id, name: this.name, email: this.email, groupId: this.groupId };
    }
}
