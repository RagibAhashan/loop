import { ProfileGroupViewData } from '@core/profile-group';
import React from 'react';
interface Props {
    profileGroups: ProfileGroupViewData[];
    defaultValue: any;
    register: any;
    error?: any;
}
const ProfileSelectDropdown: React.FunctionComponent<Props> = (props) => {
    const { profileGroups, defaultValue, register, error } = props;

    return (
        <label>
            Profile
            <select className={error && 'input--error'} defaultValue={defaultValue} style={{ width: 200 }} {...register}>
                {profileGroups.map((profileGroup) => {
                    return (
                        <optgroup key={profileGroup.id} label={profileGroup.name}>
                            {profileGroup.profiles.map((profile) => {
                                return (
                                    <option key={profile.id} value={`${profile.groupId}:${profile.id}`}>
                                        {profile.name}
                                    </option>
                                );
                            })}
                        </optgroup>
                    );
                })}
            </select>
        </label>
    );
};

export default ProfileSelectDropdown;
