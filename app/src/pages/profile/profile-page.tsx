import ProfileGroupContainer from '@components/profile-group/profile-group-container';
import ProfileContainer from '@components/profile/profile-container';
import React from 'react';

const ProfilePage = () => {
    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}>
            <div
                style={{
                    width: '250px',
                    height: '100%',
                    backgroundColor: '#2a2e31',
                }}
            >
                <ProfileGroupContainer></ProfileGroupContainer>
            </div>
            <div style={{ height: '100%', width: '100%' }}>
                <ProfileContainer></ProfileContainer>
            </div>
        </div>
    );
};

export default ProfilePage;
