import { generateId } from '@core/helpers';
import { ProfileGroupChannel } from '@core/ipc-channels';
import { profileGroupPrefix } from '@core/profile-group';
import { Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
}

const AddProfileGroupModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen } = props;
    const [name, setName] = useState('New Profile Group');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.ElectronBridge.send(ProfileGroupChannel.addProfileGroup, generateId(profileGroupPrefix), name);
        setOpen(false);
    };

    return (
        <Modal
            title={'New Profile Group'}
            visible={isOpen}
            onCancel={() => setOpen(false)}
            onOk={onSubmit}
            okButtonProps={{ disabled: !name.trim() }}
        >
            <label>
                Name
                <Input id="groupName" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
        </Modal>
    );
};

export default AddProfileGroupModal;
