import { debug } from './log';
import { ProfileGroup } from './profile-group';

const log = debug.extend('ProfileGroupFactory');

export class ProfileGroupFactory {
    constructor() {}

    public createProfileGroup(id: string, name: string): ProfileGroup {
        const profileGroup = new ProfileGroup(id, name);
        return profileGroup;
    }
}
