import { IProfile } from '@core/Profile';
import React from 'react';
import './profiles.css';

interface Props {
    profile: IProfile;
    onProfileClick: (profileName: string) => void;
}
const ProfileCard: React.FunctionComponent<Props> = (props) => {
    const { profile, onProfileClick } = props;

    const profileName = profile.profileName;
    const creditCardNumber = profile.profileData.payment.number;
    const len = creditCardNumber.length;
    const creditCardNumberParsed = `${creditCardNumber.substring(0, 4)}
    ${creditCardNumber.substring(4, 8)} ${creditCardNumber.substring(8, 12)} ${creditCardNumber.substring(12, len)}`;

    const userFullName = `${profile.profileData.shipping.firstName} ${profile.profileData.shipping.lastName}`.toUpperCase();

    return (
        <div className="profileCard" onClick={() => onProfileClick(profileName)}>
            <h2 style={{ fontSize: '16px' }}> {profileName} </h2>
            <h2 style={{ fontSize: '16px', marginTop: '35px' }}> {creditCardNumberParsed} </h2>
            <h4 style={{ fontSize: '12px', marginTop: '-10px' }}> {userFullName} </h4>
        </div>
    );
};

export default ProfileCard;
