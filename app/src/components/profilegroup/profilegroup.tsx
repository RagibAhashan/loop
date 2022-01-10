import { CloseCircleOutlined } from '@ant-design/icons';
import Editable from '@components/base/editable';
import { ProfileGroupChannel } from '@core/ipc-channels';
import { ProfileGroupViewData } from '@core/profilegroup';
import { Button } from 'antd';
import React from 'react';

interface Props {
    profileGroup: ProfileGroupViewData;
    selectedProfileGroup: ProfileGroupViewData | undefined;
}

const ProfileGroup: React.FunctionComponent<Props> = (props) => {
    const { profileGroup, selectedProfileGroup } = props;

    const isSelected = selectedProfileGroup ? profileGroup.id === selectedProfileGroup.id : false;

    const handleClickProfileGroup = () => {
        window.ElectronBridge.send(ProfileGroupChannel.getAllProfilesFromProfileGroup, profileGroup.id);
    };
    const handleRemoveProfileGroupClick = (event) => {
        window.ElectronBridge.send(ProfileGroupChannel.removeProfileGroup, profileGroup.id);
        event.stopPropagation();
    };

    const handleProfileGroupNameEdit = (value: string) => {
        window.ElectronBridge.send(ProfileGroupChannel.editProfileGroupName, profileGroup.id, value);
    };

    return (
        <div
            style={{
                width: '190px',
                height: '100px',
                backgroundColor: '#212427',
                padding: 10,
                margin: 10,
                borderRadius: 5,
                border: isSelected ? '1px solid rgb(177 142 15 / 92%)' : undefined,
            }}
            onClick={handleClickProfileGroup}
        >
            <div>
                <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={handleRemoveProfileGroupClick} />
            </div>
            <div>
                <Editable value={profileGroup.name} onSubmit={handleProfileGroupNameEdit} />
            </div>
        </div>
    );
};

export default ProfileGroup;
