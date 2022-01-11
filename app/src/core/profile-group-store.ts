import { AppDatabase } from './app-database';
import { debug } from './log';
import { IProfile, Profile, ProfileFormData, ProfileViewData } from './profile';
import { ProfileFactory } from './profile-factory';
import { IProfileGroup, ProfileGroup, ProfileGroupViewData } from './profile-group';
import { ProfileGroupFactory } from './profile-group-factory';

const log = debug.extend('ProfileGroupStore');
export type ProfileGroupMap = Map<string, ProfileGroup>;

export class ProfileGroupStore {
    private profileGroupMap: ProfileGroupMap;
    private database: AppDatabase;
    private profileGroupFactory: ProfileGroupFactory;
    private profileFactory: ProfileFactory;

    constructor(database: AppDatabase, profileGroupFactory: ProfileGroupFactory, profileFactory: ProfileFactory) {
        this.profileGroupMap = new Map();
        this.database = database;
        this.profileGroupFactory = profileGroupFactory;
        this.profileFactory = profileFactory;
    }

    public async loadFromDB(): Promise<void> {
        const profileGroups = await this.database.loadModelDB<IProfileGroup[]>('ProfileGroup');
        const profiles = await this.database.loadModelDB<IProfile[]>('Profile');

        if (!profiles || !profileGroups) return;

        for (const profileGroup of profileGroups) {
            this.addProfileGroup(profileGroup.id, profileGroup.name);
            this.addProfileToGroup(
                profileGroup.id,
                profiles.filter((profile) => profile.groupId === profileGroup.id),
            );
        }

        log('Loaded');
    }

    public async saveToDB(): Promise<boolean> {
        const profileGroupsSaved = await this.database.saveModelDB<IProfileGroup[]>('ProfileGroup', this.getAllProfileGroups());
        const profileSaved = await this.database.saveModelDB<Partial<Profile>[]>('Profile', this.getAllProfilesDB());

        if (!profileGroupsSaved || !profileSaved) return false;

        log('ProfileGroup Saved to DB!');
        return true;
    }

    public getProfileGroup(id: string): ProfileGroup {
        const profileGroup = this.profileGroupMap.get(id);

        if (!profileGroup) throw new Error('getProfileGroup: Could not find group');

        return profileGroup;
    }

    public getAllProfileGroups(): ProfileGroup[] {
        return Array.from(this.profileGroupMap.values());
    }

    public getAllProfileGroupsViewData(): ProfileGroupViewData[] {
        const profileGroups: ProfileGroupViewData[] = [];
        this.profileGroupMap.forEach((profileGroup) => profileGroups.push(profileGroup.getViewData()));
        return profileGroups;
    }

    public getAllProfilesDB(): Partial<Profile>[] {
        const profiles: Partial<Profile>[] = [];
        this.profileGroupMap.forEach((profileGroup) => profiles.push(...profileGroup.getAllProfilesDB()));
        return profiles;
    }

    public addProfileGroup(id: string, name: string): ProfileGroupViewData[] | null {
        if (this.profileGroupMap.has(id)) {
            log('[Profile Group %s already exists]', id);
            return null;
        }

        const newProfileGroup = this.profileGroupFactory.createProfileGroup(id, name);

        this.profileGroupMap.set(id, newProfileGroup);
        return this.getAllProfileGroupsViewData();
    }

    public removeProfileGroup(id: string): ProfileGroupViewData[] | null {
        if (!this.profileGroupMap.has(id)) {
            log('[Profile Group not found]');
            return null;
        }

        this.profileGroupMap.delete(id);

        return this.getAllProfileGroupsViewData();
    }

    public addProfileToGroup(groupId: string, profiles: ProfileFormData[]): ProfileViewData[] {
        const profileGroup = this.getProfileGroup(groupId);

        for (const profile of profiles) {
            const newProfile = this.profileFactory.createProfile(groupId, profile);
            profileGroup.addProfile(newProfile);
        }

        return profileGroup.getAllProfilesViewData();
    }

    public removeProfileFromGroup(groupId: string, profileIds: string[]): ProfileViewData[] {
        const profileGroup = this.getProfileGroup(groupId);

        for (const profileId of profileIds) {
            profileGroup.removeProfile(profileId);
        }

        return profileGroup.getAllProfilesViewData();
    }

    public removeAllProfilesFromGroup(groupId: string): ProfileViewData[] {
        const profileGroup = this.getProfileGroup(groupId);

        profileGroup.removeAllProfiles();

        return profileGroup.getAllProfilesViewData();
    }
}
