import { ProfileGroupChannel } from '@core/IpcChannels';
import { ProfileGroupViewData } from '@core/ProfileGroup';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProfileGroupModal from './add-profilegroup-modal';
import ProfileGroupList from './profilegroup-list';

const ProfileGroupContainer: React.FunctionComponent = () => {
    const [profileGroups, setProfileGroups] = useState<ProfileGroupViewData[]>([]);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        window.ElectronBridge.invoke(ProfileGroupChannel.getAllProfileGroups).then((data: ProfileGroupViewData[]) => {
            setProfileGroups(data);
        });

        window.ElectronBridge.on(ProfileGroupChannel.profileGroupUpdated, handleProfileGroupUpdated);
        window.ElectronBridge.on(ProfileGroupChannel.profileGroupError, handleProfileGroupExists);

        return () => {
            window.ElectronBridge.removeAllListeners(ProfileGroupChannel.profileGroupUpdated);
            window.ElectronBridge.removeAllListeners(ProfileGroupChannel.profileGroupError);
        };
    }, []);

    const handleProfileGroupUpdated = (_, profileGroups: ProfileGroupViewData[], msg?: string) => {
        setProfileGroups(profileGroups);
        if (msg) message.success(msg, 1);
    };

    const handleProfileGroupExists = (_) => {
        message.error('Profile Group Already Exists');
    };

    const handleAddProfileGroup = () => {
        setOpen(true);
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
            <Button style={{ marginBottom: 10 }} onClick={handleAddProfileGroup}>
                Add Profile Group
            </Button>

            <ProfileGroupList profileGroups={profileGroups}> </ProfileGroupList>
            <AddProfileGroupModal isOpen={isOpen} setOpen={setOpen}></AddProfileGroupModal>
        </div>
    );
};

export default ProfileGroupContainer;
