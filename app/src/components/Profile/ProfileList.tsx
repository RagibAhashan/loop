import { IProfile } from '@core/Profile';
import React from 'react';
import ProfileCard from './ProfileCard';

interface Props {
    profiles: IProfile[];
    onProfileClick: (profileName: string) => void;
}
const ProfileList: React.FunctionComponent<Props> = (props) => {
    const { profiles, onProfileClick } = props;

    return (
        <div>
            {profiles.map((profile) => (
                <ProfileCard key={profile.profileName} profile={profile} onProfileClick={onProfileClick}></ProfileCard>
            ))}
        </div>
    );
};

export default ProfileList;
