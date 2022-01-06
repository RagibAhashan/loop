import { CloseCircleOutlined } from '@ant-design/icons';
import { ProfileGroupChannel } from '@core/ipc-channels';
import { ProfileGroupViewData } from '@core/profilegroup';
import { Button } from 'antd';
import React from 'react';

interface Props {
    profileGroup: ProfileGroupViewData;
    selectedProfileGroup: ProfileGroupViewData;
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
            <div>{profileGroup.name}</div>
        </div>
    );
};

export default ProfileGroup;
