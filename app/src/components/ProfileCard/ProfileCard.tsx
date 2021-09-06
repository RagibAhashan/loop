import React from 'react';
import { UserProfile } from '../../interfaces/TaskInterfaces';

const ProfileCard = (props: any) => {
    const { profile, onProfileClick }: { profile: UserProfile; onProfileClick: (profile: UserProfile) => void } = props;

    const profileName = profile.name;
    const full_num = profile.payment.number;
    const len = full_num.length;
    const cc_num = `${full_num.substring(0, 4)} ${full_num.substring(4, 8)} ${full_num.substring(8, 12)} ${full_num.substring(12, len)}`;

    const cc_number = cc_num;
    const userName = `${profile.shipping.firstName} ${profile.shipping.lastName}`.toUpperCase();

    return (
        <div className="profileCard" onClick={() => onProfileClick(profile)}>
            <h2 style={{ fontSize: '16px' }}> {profileName} </h2>
            <h2 style={{ fontSize: '16px', marginTop: '35px' }}> {cc_number} </h2>
            <h4 style={{ fontSize: '12px', marginTop: '-10px' }}> {userName} </h4>
        </div>
    );
};

export default ProfileCard;
