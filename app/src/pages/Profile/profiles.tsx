import ProfileCard from '@components/ProfileCard/ProfileCard';
import { Divider } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserProfile } from '../../interfaces/TaskInterfaces';
import { getProfiles } from '../../services/Profile/ProfileService';
import CreateNewProfileModal from './createNewProfile';
import EditProfileModal from './editProfileModal';
import './profiles.css';

const ProfilePage = () => {
    const allProfiles = useSelector(getProfiles);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<UserProfile>();

    const onProfileClick = (profile: UserProfile) => {
        console.log('profile has been selected', profile);
        setSelectedProfile(profile);
        setIsEditModalVisible(true);
    };

    const showProfiles = () => {
        if (!Object.keys(allProfiles).length) return <h1> No Profile Found. </h1>;
        return Object.entries(allProfiles).map(([name, profile]) => <ProfileCard key={name} profile={profile} onProfileClick={onProfileClick} />);
    };

    return (
        <div style={{ backgroundColor: '#212427', height: '100vh', padding: '20px', overflow: 'auto' }}>
            <div style={{ float: 'right' }}>
                <CreateNewProfileModal />
            </div>
            <Divider> My Profiles </Divider>
            <div style={{ padding: 24, backgroundColor: '#212427', display: 'flex', flexWrap: 'wrap' }}>
                {isEditModalVisible ? (
                    // Dont change this. It will literally break everything.
                    // There is a deficit in the Modal design in antd.
                    <EditProfileModal
                        isEditModalVisible={isEditModalVisible}
                        setIsEditModalVisible={setIsEditModalVisible}
                        profile={selectedProfile}
                    />
                ) : (
                    <div />
                )}

                {showProfiles()}
            </div>
        </div>
    );
};

export default ProfilePage;
