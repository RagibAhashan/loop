import ProfileContainer from '@components/Profile/ProfileContainer';
import { Divider } from 'antd';
import React from 'react';

const ProfilePage = () => {
    return (
        <div style={{ backgroundColor: '#212427', height: '100vh', padding: '20px', overflow: 'auto' }}>
            <Divider> My Profiles </Divider>
            <ProfileContainer></ProfileContainer>
        </div>
    );
};

export default ProfilePage;
