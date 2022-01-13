import EventEmitter from 'events';
import puppeteer from 'puppeteer';
import { CookieJar } from './cookie-jar';
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
    sessionCookies: CookieJar;

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
        this.sessionCookies = new CookieJar(this.logInPage);
    }

    public setTaskId(value: EntityId | null): void {
        this.taskId = value;
    }

    /*
    Returns puppeteer page and browser
    */
    protected async openLoginPage(): Promise<any> {
        try {
            const browser = await puppeteer.launch({ headless: false, defaultViewport: null, executablePath: this.settings.browserPath });

            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);

            await page.goto(this.logInPage, { timeout: 0, waitUntil: 'load' });

            return page;
        } catch (error) {
            this.emitStatus('error', 'Could not open browser');
            throw new Error(error);
        }
    }

    public async logIn(): Promise<void> {
        this.emitStatus('info', 'Opening browser...');

        const page = await this.openLoginPage();

        this.emitStatus('info', 'Waiting for login');

        await page.waitForNavigation();

        const cookiesJSON = await page.cookies();

        this.loggedIn = true;
        this.sessionCookies.saveInSessionFromJSON(cookiesJSON);

        page.browser().close();

        this.emitStatus('success', 'Logged in');
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
