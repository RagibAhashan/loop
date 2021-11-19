import AddProfileModal from '@components/Profile/AddProfileModal';
import { ProfileChannel } from '@core/IpcChannels';
import { IProfile } from '@core/Profile';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import EditProfileModal from './EditProfileModal';
import ProfileList from './ProfileList';

const ProfileContainer: React.FunctionComponent = () => {
    const [profiles, setProfiles] = useState<IProfile[]>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [currentProfileName, setCurrentProfileName] = useState<string>();

    useEffect(() => {
        console.log('init profile container');
        window.ElectronBridge.invoke(ProfileChannel.getAllProfiles).then((data: IProfile[]) => {
            setProfiles(data);
        });

        window.ElectronBridge.on(ProfileChannel.profileUpdated, handleProfileUpdated);
        window.ElectronBridge.on(ProfileChannel.profileError, handleProfileExists);

        return () => {
            console.log('destroy profile container');
            window.ElectronBridge.removeAllListeners(ProfileChannel.profileUpdated);
            window.ElectronBridge.removeAllListeners(ProfileChannel.profileError);
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
        setShowAddModal(true);
    };

    const handleOnProfileClick = (profileName: string): void => {
        setShowEditModal(true);
        setCurrentProfileName(profileName);
    };

    return (
        <div>
            <Button style={{ marginBottom: 10 }} onClick={handleAddProfile}>
                Add Profile
            </Button>

            <ProfileList profiles={profiles} onProfileClick={handleOnProfileClick}></ProfileList>
            <AddProfileModal showModal={showAddModal} setShowModal={setShowAddModal}></AddProfileModal>
            <EditProfileModal showModal={showEditModal} setShowModal={setShowEditModal} profileName={currentProfileName}></EditProfileModal>
        </div>
    );
};

export default ProfileContainer;
