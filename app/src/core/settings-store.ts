import { AppDatabase } from './app-database';
import { debug } from './log';
import { ISettings, Settings, SettingsViewData } from './settings';

const log = debug.extend('SettingsStore');

export class SettingsStore {
    private database: AppDatabase;
    private settings: Settings;

    constructor(database: AppDatabase, settings: Settings) {
        this.database = database;
        this.settings = settings;
    }

    public async loadFromDB(): Promise<void> {
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

    public getSettingsViewData(): SettingsViewData {
        return this.settings.getViewData();
    }
}
