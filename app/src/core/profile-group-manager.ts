import { ipcMain } from 'electron';
import { CreditCardFormData, ICreditCard } from './credit-card';
import { CreditCardFactory } from './credit-card-factory';
import { ProfileGroupChannel } from './ipc-channels';
import { debug } from './log';
import { Manager } from './manager';
import { ProfileFormData, ProfileViewData, UserProfile } from './profile';
import { ProfileGroup, ProfileGroupViewData } from './profile-group';
import { ProfileGroupStore } from './profile-group-store';

const log = debug.extend('ProfileGroupManager');
export type ProfileGroupMap = Map<string, ProfileGroup>;

export class ProfileGroupManager extends Manager {
    private profileGroupStore: ProfileGroupStore;
    private creditCardFactory: CreditCardFactory;
    constructor(profileGroupStore: ProfileGroupStore, creditCardFactory: CreditCardFactory) {
        super();
        this.profileGroupStore = profileGroupStore;
        this.creditCardFactory = creditCardFactory;
    }

    protected async loadFromDB(): Promise<void> {
        await this.profileGroupStore.loadFromDB();
    }

    private editProfileGroupName(groupId: string, newName: string): ProfileGroupViewData[] {
        const profileGroup = this.profileGroupStore.getProfileGroup(groupId);

        profileGroup.editName(newName);

        return this.profileGroupStore.getAllProfileGroupsViewData();
    }

    private editProfileName(groupId: string, profileId: string, newName: string): ProfileViewData[] {
        const profileGroup = this.profileGroupStore.getProfileGroup(groupId);

        const profile = profileGroup.getProfile(profileId);

        profile.editProfileName(newName);

        return profileGroup.getAllProfilesViewData();
    }

    private editBilling(groupId: string, profileId: string, billUpate: Partial<UserProfile>): ProfileViewData[] {
        const profileGroup = this.profileGroupStore.getProfileGroup(groupId);

        const profile = profileGroup.getProfile(profileId);

        log('got profile billing to edit', profile);
        profile.editBilling(billUpate);

        log('after billing update', profile);

        return profileGroup.getAllProfilesViewData();
    }

    private editShipping(groupId: string, profileId: string, shipUpate: Partial<UserProfile>): ProfileViewData[] {
        const profileGroup = this.profileGroupStore.getProfileGroup(groupId);

        const profile = profileGroup.getProfile(profileId);

        profile.editShipping(shipUpate);

        return profileGroup.getAllProfilesViewData();
    }

    private editPayment(groupId: string, profileId: string, paymentUpdate: CreditCardFormData): ProfileViewData[] {
        const profileGroup = this.profileGroupStore.getProfileGroup(groupId);

        const profile = profileGroup.getProfile(profileId);

        profile.editPayment(paymentUpdate);

        return profileGroup.getAllProfilesViewData();
    }

    protected registerListeners(): void {
        ipcMain.handle(ProfileGroupChannel.getAllProfileGroups, (_): ProfileGroupViewData[] => {
            return this.profileGroupStore.getAllProfileGroupsViewData();
        });

        ipcMain.on(ProfileGroupChannel.addProfileGroup, (event, id: string, name: string) => {
            const profileGroups = this.profileGroupStore.addProfileGroup(id, name);
            if (profileGroups) {
                event.reply(ProfileGroupChannel.profileGroupUpdated, profileGroups, 'Profile Group Added');
            } else {
                event.reply(ProfileGroupChannel.profileGroupError);
            }
        });

        ipcMain.on(ProfileGroupChannel.removeProfileGroup, (event, id: string) => {
            const profileGroups = this.profileGroupStore.removeProfileGroup(id);
            if (profileGroups) {
                event.reply(ProfileGroupChannel.profileGroupUpdated, profileGroups, 'Profile Group Deleted');
            } else {
                event.reply(ProfileGroupChannel.profileGroupError);
            }
        });

        ipcMain.on(ProfileGroupChannel.getAllProfilesFromProfileGroup, (event, id: string) => {
            const profileGroup = this.profileGroupStore.getProfileGroup(id);
            if (profileGroup) {
                const profiles = profileGroup.getAllProfilesViewData();
                event.reply(ProfileGroupChannel.onProfileGroupSelected, profileGroup.getViewData(), profiles);
            }
        });

        ipcMain.handle(ProfileGroupChannel.getProfileFromProfileGroup, (event, groupId: string, profileId: string): ProfileViewData => {
            const profileGroup = this.profileGroupStore.getProfileGroup(groupId);

            const profile = profileGroup.getProfile(profileId);

            return profile.getViewData();
        });

        ipcMain.on(ProfileGroupChannel.addProfileToGroup, (event, groupId: string, profileDatas: ProfileFormData[]) => {
            const profilesView = this.profileGroupStore.addProfileToGroup(groupId, profileDatas);

            if (profilesView) {
                event.reply(ProfileGroupChannel.profilesUpdated, profilesView);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.removeProfileFromProfileGroup, (event, groupId: string, profileIds: string[]) => {
            const profiles = this.profileGroupStore.removeProfileFromGroup(groupId, profileIds);

            if (profiles) {
                event.reply(ProfileGroupChannel.profilesUpdated, profiles);
            } else {
                event.reply(ProfileGroupChannel.profileGroupError, 'Error');
            }
        });

        ipcMain.on(ProfileGroupChannel.removeAllProfilesFromProfileGroup, (event, groupId: string) => {
            const profiles = this.profileGroupStore.removeAllProfilesFromGroup(groupId);

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
