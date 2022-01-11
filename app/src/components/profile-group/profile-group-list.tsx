import { ProfileGroupChannel } from '@core/ipc-channels';
import { ProfileGroupViewData } from '@core/profile-group';
import React, { useEffect, useState } from 'react';
import ProfileGroup from './profile-group';

interface Props {
    profileGroups: ProfileGroupViewData[];
}
const ProfileGroupList: React.FunctionComponent<Props> = (props) => {
    const { profileGroups } = props;

    // Only used to style focus the selected task group
    const [selectedProfileGroup, setSelectedProfileGroup] = useState<ProfileGroupViewData | undefined>(undefined);

    useEffect(() => {
        window.ElectronBridge.on(ProfileGroupChannel.onProfileGroupSelected, handleOnProfileGroupSelected);

        return () => {
            window.ElectronBridge.removeAllListeners(ProfileGroupChannel.onProfileGroupSelected);
        };
    }, []);

    const handleOnProfileGroupSelected = (_, profileGroup: ProfileGroupViewData) => {
        setSelectedProfileGroup(profileGroup);
    };

    return (
        <div>
            {profileGroups.map((profileGroup) => (
                <ProfileGroup key={profileGroup.id} profileGroup={profileGroup} selectedProfileGroup={selectedProfileGroup}></ProfileGroup>
            ))}
        </div>
    );
};

export default ProfileGroupList;
