import { debug } from './log';
import { Profile, ProfileViewData } from './profile';
import { Viewable } from './viewable';

const log = debug.extend('ProfileGroup');

export const profileGroupPrefix = 'profgrp';

export interface ProfileGroupViewData {
    id: string;
    name: string;
    profiles: ProfileViewData[];
}

export interface IProfileGroup {
    id: string;
    name: string;
}

export type ProfileMap = Map<string, Profile>;

export class ProfileGroup implements IProfileGroup, Viewable<ProfileGroupViewData> {
    static prefix: 'prgrp';
    name: string;
    id: string;
    profiles: ProfileMap;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.profiles = new Map();
    }

    public getViewData(): ProfileGroupViewData {
        return {
            name: this.name,
            profiles: this.getAllProfilesViewData(),
            id: this.id,
        };
    }

    public addProfile(profile: Profile): void {
        //Should never happen
        if (this.profiles.has(profile.id)) {
            log('ID already exists in profile map, could not add profile %s to group %s', profile.profileName, this.name);
            return;
        }

        this.profiles.set(profile.id, profile);
    }

    public removeProfile(id: string): void {
        if (this.profiles.has(id)) {
            this.profiles.delete(id);
        }
    }

    public removeAllProfiles(): void {
        // stop all tasks
        this.profiles = new Map();
    }

    public getAllProfiles(): Profile[] {
        return Array.from(this.profiles.values());
    }

    public getProfile(id: string): Profile {
        return this.profiles.get(id);
    }

    public getAllProfilesViewData(): ProfileViewData[] {
        const profiles: ProfileViewData[] = [];
        this.profiles.forEach((profile) => profiles.push(profile.getViewData()));
        return profiles;
    }

    public getProfileViewData(id: string): ProfileViewData {
        const profile = this.profiles.get(id);
        return profile.getViewData();
    }

    public getAllProfilesDB(): Partial<Profile>[] {
        const profiles: Partial<Profile>[] = [];
        this.profiles.forEach((profile) => profiles.push(profile.getValueDB()));
        return profiles;
    }

    public editName(newName: string): void {
        this.name = newName;
    }
}
