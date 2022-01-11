import EventEmitter from 'events';
import puppeteer from 'puppeteer-core';
import { EntityId } from './entity-id';
import { AccountEmittedEvents, AccountStatus, AccountStatusLevel, AccountViewData, IAccount } from './models/account';
import { Settings } from './settings';
import { Viewable } from './viewable';

export abstract class Account extends EventEmitter implements IAccount, Viewable<AccountViewData> {
    id: string;
    groupId: string;
    name: string;
    email: string;
    password: string;
    loggedIn: boolean;
    logInPage: string;
    loginProxy: string;
    settings: Settings;
    taskId: EntityId | null;
    status: AccountStatus;

    constructor(
        id: string,
        groupId: string,
        name: string,
        email: string,
        password: string,
        loginProxy: string,
        settings: Settings,
        status: AccountStatus,
    ) {
        super();
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.loggedIn = false;
        this.logInPage = '';
        this.loginProxy = loginProxy;
        this.settings = settings;
        this.groupId = groupId;
        this.taskId = null;
        this.status = status;
    }

    public setTaskId(value: EntityId | null): void {
        this.taskId = value;
    }

    abstract logIn(): void;

    protected async openLoginPage(): Promise<puppeteer.Browser> {
        try {
            const browser = await puppeteer.launch({ headless: false, defaultViewport: null, executablePath: this.settings.browserPath });

            browser.on('disconnected', async () => {
                console.log('browser disconnected');
                console.log('cookies', await page.cookies());
            });
            const page = await browser.newPage();
            await page.goto(this.logInPage);
            return browser;
        } catch (error) {
            this.emitStatus('error', 'Could not open browser');
            throw new Error(error);
        }
    }

    public logOut(): void {
        this.loggedIn = false;
        // TODO clear cookies
    }

    public getViewData(): AccountViewData {
        return { id: this.id, name: this.name, email: this.email, groupId: this.groupId, status: this.status, loggedIn: this.loggedIn };
    }

    protected emitStatus(level: AccountStatusLevel, message: string): void {
        this.emit(AccountEmittedEvents.Status, { level, message });
        this.status = { level, message };
    }
}
