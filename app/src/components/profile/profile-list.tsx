import { ProfileViewData } from '@core/profile';
import React from 'react';
import ProfileCardWrapper from './profile-card-wrapper';

interface Props {
    profiles: ProfileViewData[];
    onEditClick: (profile: ProfileViewData) => void;
}
const ProfileList: React.FunctionComponent<Props> = (props) => {
    const { profiles, onEditClick } = props;

    return profiles.length ? (
        <div className="profile-list">
            {profiles.map((profile) => (
                <ProfileCardWrapper key={profile.id} profile={profile} onEditClick={onEditClick}></ProfileCardWrapper>
            ))}
        </div>
    ) : (
        <div> No profiles </div>
    );
};

export default ProfileList;
