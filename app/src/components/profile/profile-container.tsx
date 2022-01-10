import { ProfileGroupChannel } from '@core/ipc-channels';
import { ProfileViewData } from '@core/profile';
import { ProfileGroupViewData } from '@core/profilegroup';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProfileModal from './add-profile-modal';
import EditProfileModal from './edit-profile-modal';
import ProfileList from './profile-list';

interface State {
    profiles: ProfileViewData[];
    selectedProfileGroup: ProfileGroupViewData | undefined;
}

const ProfileContainer: React.FunctionComponent = () => {
    const [profileContainerState, setProfileContainerState] = useState<State>({ profiles: [], selectedProfileGroup: undefined });

    const [isAddOpen, setAddOpen] = useState<boolean>(false);
    const [isEditOpen, setEditOpen] = useState<boolean>(false);
    const [selectedProfile, setSelectedProfile] = useState<ProfileViewData>();

    useEffect(() => {
        window.ElectronBridge.on(ProfileGroupChannel.onProfileGroupSelected, handleOnProfileGroupSelected);
        window.ElectronBridge.on(ProfileGroupChannel.profilesUpdated, handleProfilesUpdated);

        return () => {
            window.ElectronBridge.removeAllListeners(ProfileGroupChannel.onProfileGroupSelected);
            window.ElectronBridge.removeAllListeners(ProfileGroupChannel.profilesUpdated);
        };
    }, []);

    const handleOnProfileGroupSelected = (_, profileGroup: ProfileGroupViewData, profiles: ProfileViewData[]) => {
        console.log('selected profile', profileGroup, profiles);
        setProfileContainerState({
            profiles: profiles,
            selectedProfileGroup: profileGroup,
        });
    };

    const handleProfilesUpdated = (_, profiles: ProfileViewData[]) => {
        console.log('got new profiles', profiles);
        setProfileContainerState((prev) => {
            return { profiles: profiles, selectedProfileGroup: prev.selectedProfileGroup };
        });
    };

    const handleAddProfile = () => {
        setAddOpen(true);
    };

    const handleOnProfileClick = (profile: ProfileViewData): void => {
        console.log('selected profile to edit', profile);
        setSelectedProfile(profile);
        setEditOpen(true);
    };

    return (
        <div>
            <h4> Profiles </h4>
            {profileContainerState.selectedProfileGroup ? (
                <div>
                    <Button style={{ marginBottom: 10 }} onClick={handleAddProfile}>
                        Add Profile
                    </Button>

                    <ProfileList profiles={profileContainerState.profiles} onEditClick={handleOnProfileClick}></ProfileList>
                    <AddProfileModal
                        isOpen={isAddOpen}
                        setOpen={setAddOpen}
                        profileGroup={profileContainerState.selectedProfileGroup}
                    ></AddProfileModal>

                    {selectedProfile && (
                        <EditProfileModal
                            isOpen={isEditOpen}
                            setOpen={setEditOpen}
                            selectedProfileGroup={profileContainerState.selectedProfileGroup}
                            profile={selectedProfile}
                        ></EditProfileModal>
                    )}
                </div>
            ) : (
                <div> No profile group selected</div>
            )}
        </div>
    );
};

export default ProfileContainer;
