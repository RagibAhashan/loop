import { ipcMain } from 'electron';
import puppeteer from 'puppeteer-core';
import { AppDatabase } from './app-database';
import { SettingsChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { ISettings, Settings, SettingsViewData } from './settings';

const log = debug.extend('SettingsManager');

export class SettingsManager extends Manager {
    private settings: Settings;

    constructor(database: AppDatabase, settings: Settings) {
        super(database);
        this.settings = settings;
    }

    protected async loadFromDB(): Promise<void> {
        const settings = await this.database.loadModelDB<ISettings>('Settings');

        if (!settings) return;

        this.settings = new Settings(settings);

        log('Settings Loaded');
    }

    public async saveToDB(): Promise<boolean> {
        const settingsSaved = await this.database.saveModelDB<ISettings>('Settings', this.getSettings());

        if (!settingsSaved) return false;

        log('Settings Saved to DB!');
        return true;
    }

    public getSettings(): Settings {
        return this.settings;
    }

    private getSettingsViewData(): SettingsViewData {
        return this.settings.getViewData();
    }

    private async setBrowserPath(path: string): Promise<void> {
        this.settings.setBrowserPath(path);
        log('Launching browser');
        const browser = await puppeteer.launch({ executablePath: path, headless: false, defaultViewport: null });
        const page = await browser.newPage();
        await page.goto('https://www.google.com');
    }

    private setDiscordWebhook(webhook: string): void {
        this.settings.setDiscordWebhook(webhook);
    }

    private setPublicCheckout(isPublic: boolean): void {
        this.settings.setPublicCheckout(isPublic);
    }

    protected registerListeners(): void {
        ipcMain.handle(SettingsChannel.getSettings, (_): SettingsViewData => {
            return this.getSettings();
        });

        ipcMain.on(SettingsChannel.setBrowserPath, (event, path: string) => {
            this.setBrowserPath(path);

            event.reply(SettingsChannel.settingsUpdated, this.getSettingsViewData(), 'Settings Updated');
        });

        ipcMain.on(SettingsChannel.setDiscordWebhook, (event, hook: string) => {
            this.setDiscordWebhook(hook);

            event.reply(SettingsChannel.settingsUpdated, this.getSettingsViewData(), 'Settings Updated');
        });

        ipcMain.on(SettingsChannel.setPublicCheckout, (event, isPublic: boolean) => {
            this.setPublicCheckout(isPublic);

            event.reply(SettingsChannel.settingsUpdated, this.getSettingsViewData(), 'Settings Updated');
        });

        ipcMain.handle(SettingsChannel.testDiscordWebhook, async (event): Promise<string | null> => {
            const status = await this.settings.testDiscordWebHook();

            return status ? null : 'Something Went Wrong';
        });
    }
}
