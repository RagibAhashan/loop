import { debug } from './Log';
import { ProfileGroup } from './ProfileGroup';

const log = debug.extend('ProfileGroupFactory');

export class ProfileGroupFactory {
    constructor() {}

    public createProfileGroup(id: string, name: string): ProfileGroup {
        const profileGroup = new ProfileGroup(id, name);
        return profileGroup;
    }
}
