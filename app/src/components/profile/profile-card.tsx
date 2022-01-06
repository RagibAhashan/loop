import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProfileGroupChannel } from '@core/ipc-channels';
import { ProfileViewData } from '@core/profile';
import { Badge, Card } from 'antd';
import React from 'react';

interface Props {
    fillCreditCard: boolean;
    profileName: string;
    userFullName: string;
    profile: ProfileViewData;
    creditCardNumber?: string;
    onEditClick: (profile: ProfileViewData) => void;
}
const ProfileCard: React.FunctionComponent<Props> = (props) => {
    const { fillCreditCard, creditCardNumber, userFullName, profileName, profile, onEditClick } = props;

    const handleDeleteProfile = () => {
        window.ElectronBridge.send(ProfileGroupChannel.removeProfileFromProfileGroup, profile.groupId, [profile.id]);
    };

    const renderDelete = () => {
        return <EditOutlined onClick={() => onEditClick(profile)} key="edit" />;
    };

    const renderEdit = () => {
        return <DeleteOutlined onClick={handleDeleteProfile} key="delete" />;
    };

    const renderActions = () => {
        return [renderDelete(), renderEdit()];
    };
    return (
        <div className="profile-box">
            <Badge.Ribbon style={{ display: !fillCreditCard ? 'none' : 'block' }} text="Fill Card" color={'red'}>
                <Card size="small" className="profile-card" actions={renderActions()}>
                    <Card.Meta title={profileName} description={userFullName} />
                    <h2 style={{ fontSize: '16px', marginTop: '35px' }}> {creditCardNumber} </h2>
                </Card>
            </Badge.Ribbon>
        </div>
    );
};

export default ProfileCard;
