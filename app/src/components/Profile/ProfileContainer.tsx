import AddProfileModal from '@components/Profile/AddProfileModal';
import { ProfileChannel } from '@core/IpcChannels';
import { IProfile } from '@core/Profile';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import ProfileList from './ProfileList';

const ProfileContainer: React.FunctionComponent = () => {
    const [profiles, setProfiles] = useState<IProfile[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        window.ElectronBridge.invoke(ProfileChannel.getAllProfiles).then((data: IProfile[]) => {
            setProfiles(data);
        });

        window.ElectronBridge.on(ProfileChannel.profileUpdated, handleProfileUpdated);
        window.ElectronBridge.on(ProfileChannel.profileError, handleProfileExists);

        return () => {
            window.ElectronBridge.removeListener(ProfileChannel.profileUpdated, handleProfileUpdated);
            window.ElectronBridge.removeListener(ProfileChannel.profileError, handleProfileExists);
        };
    }, []);

    const handleProfileUpdated = (_, profiles: IProfile[]) => {
        setProfiles(profiles);
        message.success('Profile Created');
    };

    const handleProfileExists = (_) => {
        message.error('Profile Already Exists');
    };

    const handleAddProfile = () => {
        setShowModal(true);
    };

    return (
        <div>
            <Button style={{ marginBottom: 10 }} onClick={handleAddProfile}>
                Add Profile
            </Button>

            <ProfileList profiles={profiles}> </ProfileList>
            <AddProfileModal showModal={showModal} setShowModal={setShowModal}></AddProfileModal>
        </div>
    );
};

export default ProfileContainer;
