import { ProfileGroupChannel } from '@core/IpcChannels';
import { ProfileGroupViewData } from '@core/ProfileGroup';
import React, { useEffect, useState } from 'react';
import ProfileGroup from './profilegroup';

interface Props {
    profileGroups: ProfileGroupViewData[];
}
const ProfileGroupList: React.FunctionComponent<Props> = (props) => {
    const { profileGroups } = props;

    // Only used to style focus the selected task group
    const [selectedProfileGroup, setSelectedProfileGroup] = useState(null);

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
