import { ipcMain } from 'electron';
import { AppDatabase } from './app-database';
import { CreditCardFormData, ICreditCard } from './credit-card';
import { ProfileGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Profile, ProfileFormData, ProfileViewData, UserProfile } from './profile';
import { ProfileFactory } from './profile-factory';
import { ProfileGroup, ProfileGroupViewData } from './profilegroup';
import { ProfileGroupFactory } from './profilegroup-factory';

const log = debug.extend('ProfileGroupManager');
export type ProfileGroupMap = Map<string, ProfileGroup>;

export class ProfileGroupManager {
    private profileGroupMap: ProfileGroupMap;
    private database: AppDatabase;
    private profileGroupFactory: ProfileGroupFactory;
    private profileFactory: ProfileFactory;

    constructor(profileGroupFactory: ProfileGroupFactory, profileFactory: ProfileFactory, database: AppDatabase) {
        this.profileGroupMap = new Map();
        this.database = database;
        this.profileGroupFactory = profileGroupFactory;
        this.profileFactory = profileFactory;
    }

    public async loadFromDB(): Promise<void> {
        const profileGroups = await this.database.loadModelDB<ProfileGroup>('ProfileGroup');
        const profiles = await this.database.loadModelDB<Partial<Profile>>('Profile');

        if (!profiles || !profileGroups) return;

        for (const profileGroup of profileGroups) {
            this.addProfileGroup(profileGroup.id, profileGroup.name);

            const profilesData: ProfileFormData[] = [];

            profiles.forEach((profile) => {
                log(profile.groupId, profileGroup.id);
                if (profile.groupId === profileGroup.id)
                    profilesData.push({
                        billing: profile.billing,
                        id: profile.id,
                        shipping: profile.shipping,
                        profileName: profile.profileName,
                        payment: profile.payment,
                    });
            });

            this.addProfileToGroup(profileGroup.id, profilesData);
        }

        log('Loaded');
    }

    public async saveToDB(): Promise<boolean> {
        const profileGroupsSaved = await this.database.saveModelDB<ProfileGroup>('ProfileGroup', this.getAllProfileGroups());
        const profileSaved = await this.database.saveModelDB<Partial<Profile>>('Profile', this.getAllProfilesDB());

        if (!profileGroupsSaved || !profileSaved) return false;

        log('ProfileGroup Saved to DB!');
        return true;
    }

    public async ready(): Promise<void> {
        this.registerListeners();
        this.loadFromDB();
    }

    private addProfileGroup(id: string, name: string): ProfileGroupViewData[] | null {
        if (this.profileGroupMap.has(id)) {
            log('[Profile Group %s already exists]', id);
            return null;
        }

        const newProfileGroup = this.profileGroupFactory.createProfileGroup(id, name);

        this.profileGroupMap.set(id, newProfileGroup);
        return this.getAllProfileGroupsViewData();
    }

    private removeProfileGroup(id: string): ProfileGroupViewData[] | null {
        if (!this.profileGroupMap.has(id)) {
            log('[Profile Group not found]');
            return null;
        }

        this.profileGroupMap.delete(id);
        return this.getAllProfileGroupsViewData();
    }

    private getAllProfileGroupsViewData(): ProfileGroupViewData[] {
        const profileGroups: ProfileGroupViewData[] = [];
        this.profileGroupMap.forEach((profileGroup) => profileGroups.push(profileGroup.getViewData()));
        return profileGroups;
    }

    private getProfileGroup(id: string): ProfileGroup | undefined {
        return this.profileGroupMap.get(id);
    }

    private getAllProfileGroups(): ProfileGroup[] {
        return Array.from(this.profileGroupMap.values());
    }

    /* 
    This call will return a profile data with unreadable credit card values unlike getAllProfileGroups
    */
    private getAllProfilesDB(): Partial<Profile>[] {
        const profiles: Partial<Profile>[] = [];
        this.profileGroupMap.forEach((profileGroup) => profiles.push(...profileGroup.getAllProfilesDB()));
        return profiles;
    }

    private addProfileToGroup(groupId: string, profileDatas: ProfileFormData[]): ProfileViewData[] | null {
        if (!this.profileGroupMap.has(groupId)) {
            log('[Adding profile to Group] Group not found');
            return null;
        }

        const profileGroup = this.profileGroupMap.get(groupId);

        for (const profileData of profileDatas) {
            const newProfile = this.profileFactory.createProfile(groupId, profileData);
            profileGroup.addProfile(newProfile);
        }

        return profileGroup.getAllProfilesViewData();
    }

    private removeProfileFromGroup(groupId: string, profileIds: string[]): ProfileViewData[] | null {
        if (!this.profileGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const profileGroup = this.profileGroupMap.get(groupId);

        for (const profileId of profileIds) {
            profileGroup.removeProfile(profileId);
        }

        return profileGroup.getAllProfilesViewData();
    }

    private removeAllProfilesFromGroup(groupId: string): ProfileViewData[] | null {
        if (!this.profileGroupMap.has(groupId)) {
            log('[Group %s not found]', groupId);
            return null;
        }

        const profileGroup = this.profileGroupMap.get(groupId);

        profileGroup.removeAllProfiles();

        return profileGroup.getAllProfilesViewData();
    }

    private editProfileGroupName(groupId: string, newName: string): ProfileGroupViewData[] {
        const profileGroup = this.profileGroupMap.get(groupId);

        profileGroup.editName(newName);

        return this.getAllProfileGroupsViewData();
    }

    private editProfileName(groupId: string, profileId: string, newName: string): ProfileViewData[] {
        const profileGroup = this.getProfileGroup(groupId);

        const profile = profileGroup.getProfile(profileId);

        profile.editProfileName(newName);

        return profileGroup.getAllProfilesViewData();
    }

    private editBilling(groupId: string, profileId: string, billUpate: Partial<UserProfile>): ProfileViewData[] {
        const profileGroup = this.getProfileGroup(groupId);

        const profile = profileGroup.getProfile(profileId);

        log('got profile billing to edit', profile);
        profile.editBilling(billUpate);

        log('after billing update', profile);

        return profileGroup.getAllProfilesViewData();
    }

    private editShipping(groupId: string, profileId: string, shipUpate: Partial<UserProfile>): ProfileViewData[] {
        const profileGroup = this.getProfileGroup(groupId);

        const profile = profileGroup.getProfile(profileId);

        profile.editShipping(shipUpate);

        return profileGroup.getAllProfilesViewData();
    }

    private editPayment(groupId: string, profileId: string, paymentUpdate: CreditCardFormData): ProfileViewData[] {
        const profileGroup = this.getProfileGroup(groupId);

        const profile = profileGroup.getProfile(profileId);

        profile.editPayment(paymentUpdate);

        return profileGroup.getAllProfilesViewData();
    }

    private registerListeners(): void {
        ipcMain.handle(ProfileGroupChannel.getAllProfileGroups, (_): ProfileGroupViewData[] => {
            return this.getAllProfileGroupsViewData();
        });

        ipcMain.on(ProfileGroupChannel.addProfileGroup, (event, id: string, name: string) => {
            const profileGroups = this.addProfileGroup(id, name);
            if (profileGroups) {
                event.reply(ProfileGroupChannel.profileGroupUpdated, profileGroups, 'Profile Group Added');
            } else {
                event.reply(ProfileGroupChannel.profileGroupError);
            }
        });

        ipcMain.on(ProfileGroupChannel.removeProfileGroup, (event, id: string) => {
            const profileGroups = this.removeProfileGroup(id);
            if (profileGroups) {
                event.reply(ProfileGroupChannel.profileGroupUpdated, profileGroups, 'Profile Group Deleted');
            } else {
                event.reply(ProfileGroupChannel.profileGroupError);
            }
        });

        ipcMain.on(ProfileGroupChannel.getAllProfilesFromProfileGroup, (event, id: string) => {
            const profileGroup = this.getProfileGroup(id);
            if (profileGroup) {
                const profiles = profileGroup.getAllProfilesViewData();
                event.reply(ProfileGroupChannel.onProfileGroupSelected, profileGroup.getViewData(), profiles);
            }
        });

        ipcMain.handle(ProfileGroupChannel.getProfileFromProfileGroup, (event, groupId: string, profileId: string): ProfileViewData => {
            const profileGroup = this.getProfileGroup(groupId);
            if (profileGroup) {
                const profile = profileGroup.getProfile(profileId);
                return profile.getViewData();
            }
        });

        ipcMain.on(ProfileGroupChannel.addProfileToGroup, (event, groupId: string, profileDatas: ProfileFormData[]) => {
            const profiles = this.addProfileToGroup(groupId, profileDatas);

            if (profiles) {
                event.reply(ProfileGroupChannel.profilesUpdated, profiles);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.removeProfileFromProfileGroup, (event, groupId: string, profileIds: string[]) => {
            const profiles = this.removeProfileFromGroup(groupId, profileIds);

            if (profiles) {
                event.reply(ProfileGroupChannel.profilesUpdated, profiles);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.removeAllProfilesFromProfileGroup, (event, groupId: string) => {
            const profiles = this.removeAllProfilesFromGroup(groupId);

            if (profiles) {
                event.reply(ProfileGroupChannel.profilesUpdated, profiles);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.editProfileGroupName, (event, groupId: string, newName: string) => {
            const profileGroups = this.editProfileGroupName(groupId, newName);

            if (profileGroups) {
                event.reply(ProfileGroupChannel.profileGroupUpdated, profileGroups);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.editProfileName, (event, groupId: string, profileId: string, newName: string) => {
            const profiles = this.editProfileName(groupId, profileId, newName);

            if (profiles) {
                event.reply(ProfileGroupChannel.profilesUpdated, profiles);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.editProfileShipping, (event, groupId: string, profileId: string, shipUpdate: Partial<UserProfile>) => {
            const profiles = this.editShipping(groupId, profileId, shipUpdate);

            if (profiles) {
                event.reply(ProfileGroupChannel.profilesUpdated, profiles);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.editProfileBilling, (event, groupId: string, profileId: string, billUpdate: Partial<UserProfile>) => {
            const profiles = this.editBilling(groupId, profileId, billUpdate);

            if (profiles) {
                event.reply(ProfileGroupChannel.profilesUpdated, profiles);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.editProfilePayment, (event, groupId: string, profileId: string, paymentUpdate: ICreditCard) => {
            const profiles = this.editPayment(groupId, profileId, paymentUpdate);

            if (profiles) {
                event.reply(ProfileGroupChannel.profilesUpdated, profiles);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });
    }
}
