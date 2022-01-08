import * as puppeteer from 'puppeteer-core';
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
    settings: Settings;
}
export abstract class Account implements IAccount, Viewable<AccountViewData> {
    id: string;
    name: string;
    email: string;
    password: string;
    loggedIn: boolean;
    logInPage: string;
    groupId: string;
    settings: Settings;

    constructor(id: string, groupId: string, name: string, email: string, password: string, settings: Settings) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.loggedIn = false;
        this.logInPage = '';
        this.settings = settings;
        this.groupId = groupId;
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
