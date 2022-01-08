import { ProfileGroupViewData } from '@core/profilegroup';
import React from 'react';
interface Props {
    profileGroups: ProfileGroupViewData[];
    defaultValue: any;
    register: any;
    name: string;
}
const ProfileSelectDropdown: React.FunctionComponent<Props> = (props) => {
    const { profileGroups, defaultValue, register, name } = props;

    return (
        <select defaultValue={defaultValue} style={{ width: 200 }} {...register(name)}>
            <option key={'null'} value={undefined}>
                No Profile
            </option>

            {profileGroups.map((profileGroup) => {
                return (
                    <optgroup key={profileGroup.id} label={profileGroup.name}>
                        {profileGroup.profiles.map((profile) => {
                            return (
                                <option key={profile.id} value={profile.profileName}>
                                    {profile.profileName}
                                </option>
                            );
                        })}
                    </optgroup>
                );
            })}
        </select>
    );
};

export default ProfileSelectDropdown;
