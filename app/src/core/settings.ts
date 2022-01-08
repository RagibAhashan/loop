import axios from 'axios';
import { debug } from './log';
import { Viewable } from './viewable';

const log = debug.extend('Settings');

export interface SettingsViewData {
    browserPath: string;
    discordWebHook: string;
    publicCheckout: boolean;
}

export interface ISettings {
    browserPath: string;
    discordWebHook: string;
    publicCheckout: boolean;
}
export class Settings implements ISettings, Viewable<SettingsViewData> {
    browserPath: string;
    discordWebHook: string;
    publicCheckout: boolean;

    constructor(settings?: ISettings) {
        if (settings) {
            this.browserPath = settings.browserPath;
            this.discordWebHook = settings.discordWebHook;
            this.publicCheckout = settings.publicCheckout;
        }
        this.browserPath = '';
        this.discordWebHook = '';
        this.publicCheckout = false;
    }

    getViewData(): SettingsViewData {
        return {
            browserPath: this.browserPath,
            discordWebHook: this.discordWebHook,
            publicCheckout: this.publicCheckout,
        };
    }

    setBrowserPath(value: string): void {
        this.browserPath = value;
    }

    setDiscordWebhook(value: string): void {
        this.discordWebHook = value;
    }

    setPublicCheckout(value: boolean): void {
        this.publicCheckout = value;
    }

    async testDiscordWebHook(): Promise<boolean> {
        try {
            const testMessage = {
                username: 'Dynasty',
                embeds: [
                    {
                        description: 'Dynasty. Webhook test message',
                        color: 11023005,
                    },
                ],
            };

            await axios.post(this.discordWebHook, testMessage);

            return true;
        } catch (error) {
            log('Something went wrong trying to test the webhook');
            return false;
        }
    }
}
