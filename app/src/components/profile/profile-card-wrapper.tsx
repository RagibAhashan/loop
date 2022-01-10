import { ProfileViewData } from '@core/profile';
import React from 'react';
import ProfileCard from './profile-card';

interface Props {
    profile: ProfileViewData;
    onEditClick: (profile: ProfileViewData) => void;
}

const ProfileCardWrapper: React.FunctionComponent<Props> = (props) => {
    const { profile, onEditClick } = props;

    const profileName = profile.name;
    const userFullName = `${profile.billing.firstName} ${profile.billing.lastName}`.toUpperCase();

    const renderProfileCard = () => {
        if (!profile.payment.number || !profile.payment.cvc) {
            return (
                <ProfileCard
                    fillCreditCard
                    userFullName={userFullName}
                    profileName={profileName}
                    profile={profile}
                    onEditClick={onEditClick}
                ></ProfileCard>
            );
        } else {
            const creditCardNumber = profile.payment.number;
            const len = creditCardNumber.length;
            const creditCardNumberParsed = `${creditCardNumber.substring(0, 4)}
            ${creditCardNumber.substring(4, 8)} ${creditCardNumber.substring(8, 12)} ${creditCardNumber.substring(12, len)}`;
            return (
                <ProfileCard
                    fillCreditCard={false}
                    userFullName={userFullName}
                    profileName={profileName}
                    profile={profile}
                    creditCardNumber={creditCardNumberParsed}
                    onEditClick={onEditClick}
                ></ProfileCard>
            );
        }
    };

    return <div>{renderProfileCard()}</div>;
};

export default ProfileCardWrapper;
