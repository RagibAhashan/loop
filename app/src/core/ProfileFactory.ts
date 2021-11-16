import { debug } from './Log';
import { Profile, ProfileData } from './Profile';

const log = debug.extend('ProfileFactory');

export class ProfileFactory {
    public static createProfile(name: string, profileData: ProfileData): Profile {
        const profile = new Profile(name, profileData);
        return profile;
    }
}
