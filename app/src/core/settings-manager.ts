import { ipcMain } from 'electron';
import { SettingsChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { SettingsViewData } from './settings';
import { SettingsStore } from './settings-store';

const log = debug.extend('SettingsManager');

export class SettingsManager extends Manager {
    private settingsStore: SettingsStore;

    constructor(settingsStore: SettingsStore) {
        super();
        this.settingsStore = settingsStore;
    }

    protected async loadFromDB(): Promise<void> {
        await this.settingsStore.loadFromDB();
    }

    private async setBrowserPath(path: string): Promise<void> {
        this.settingsStore.getSettings().setBrowserPath(path);
    }

    private setDiscordWebhook(webhook: string): void {
        this.settingsStore.getSettings().setDiscordWebhook(webhook);
    }

    private setPublicCheckout(isPublic: boolean): void {
        this.settingsStore.getSettings().setPublicCheckout(isPublic);
    }

    protected registerListeners(): void {
        ipcMain.handle(SettingsChannel.getSettings, (_): SettingsViewData => {
            return this.settingsStore.getSettings();
        });

        ipcMain.on(SettingsChannel.setBrowserPath, (event, path: string) => {
            this.setBrowserPath(path);

            event.reply(SettingsChannel.settingsUpdated, this.settingsStore.getSettingsViewData(), 'Settings Updated');
        });

        ipcMain.on(SettingsChannel.setDiscordWebhook, (event, hook: string) => {
            this.setDiscordWebhook(hook);

            event.reply(SettingsChannel.settingsUpdated, this.settingsStore.getSettingsViewData(), 'Settings Updated');
        });

        ipcMain.on(SettingsChannel.setPublicCheckout, (event, isPublic: boolean) => {
            this.setPublicCheckout(isPublic);

            event.reply(SettingsChannel.settingsUpdated, this.settingsStore.getSettingsViewData(), 'Settings Updated');
        });

        ipcMain.handle(SettingsChannel.testDiscordWebhook, async (event): Promise<string | null> => {
            const status = await this.settingsStore.getSettings().testDiscordWebHook();

            return status ? null : 'Something Went Wrong';
        });
    }
}
