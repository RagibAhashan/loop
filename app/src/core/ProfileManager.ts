import { ipcMain } from 'electron';
import { ProfileChannel } from './IpcChannels';
import { debug } from './Log';
import { IProfile, Profile, ProfileData } from './Profile';
import { ProfileFactory } from './ProfileFactory';

const log = debug.extend('ProfileManager');
export type ProfileMap = Map<string, Profile>;
export class ProfileManager {
    private profileMap: ProfileMap;

    constructor() {
        this.profileMap = new Map();
    }

    public ready(): void {
        this.registerListeners();
    }

    private addProfile(name: string, profileData: ProfileData): IProfile[] | null {
        if (this.profileMap.has(name)) {
            log('[Profile %s already exists]', name);
            return null;
        }

        const newProfile = ProfileFactory.createProfile(name, profileData);

        this.profileMap.set(name, newProfile);
        return this.getAllProfiles();
    }

    private removeProfile(name: string): IProfile[] | null {
        if (!this.profileMap.has(name)) {
            log('[Profile %s not found]', name);
            return null;
        }

        this.profileMap.delete(name);
        return this.getAllProfiles();
    }

    private getProfile(name: string): Profile | undefined {
        return this.profileMap.get(name);
    }

    private getAllProfiles(): IProfile[] {
        return Array.from(this.profileMap.values());
    }

    private editProfileName(oldName: string, newName: string): void {
        const profile = this.profileMap.get(oldName);
        profile.editProfileName(newName);
    }

    private editBilling(profileName: string, key: string, value: string): void {
        const profile = this.profileMap.get(profileName);
        profile.editBilling(key, value);
    }

    private editShipping(profileName: string, key: string, value: string): void {
        const profile = this.profileMap.get(profileName);
        profile.editShipping(key, value);
    }

    private registerListeners(): void {
        ipcMain.handle(ProfileChannel.getAllProfiles, (_) => {
            return this.getAllProfiles();
        });

        ipcMain.on(ProfileChannel.addProfile, (event, name: string, profileData: ProfileData) => {
            const profile = this.addProfile(name, profileData);
            if (profile) {
                event.reply(ProfileChannel.profileUpdated, profile);
            } else {
                event.reply(ProfileChannel.profileError);
            }
        });

        ipcMain.on(ProfileChannel.removeProfile, (event, name: string) => {
            const profile = this.removeProfile(name);
            if (profile) {
                event.reply(ProfileChannel.profileUpdated, profile);
            } else {
                event.reply(ProfileChannel.profileError);
            }
        });

        ipcMain.handle(ProfileChannel.getProfile, (event, name: string): Profile => {
            const profile = this.getProfile(name);
            if (profile) {
                return profile;
            }
        });

        // TODO add listeners for profile data edit.
    }
}
