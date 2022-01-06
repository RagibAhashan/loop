import { getStores } from '@constants/Stores';
import { TaskGroupChannel } from '@core/ipc-channels';
import { Button, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    setOpen: (valuse: boolean) => void;
}

const GUTTER: [number, number] = [16, 0];

const AddTaskGroupModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen } = props;

    const [name, setName] = useState('New Task Group');
    const [store, setStore] = useState('');

    const onSubmit = () => {
        window.ElectronBridge.send(TaskGroupChannel.addTaskGroup, name, store);
        setOpen(false);
    };

    return (
        <Modal title={'New Profile Group'} visible={isOpen} onCancel={() => setOpen(false)} footer={<Button onClick={onSubmit}>Add</Button>}>
            <Input id="groupName" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <Select placeholder="Select store" onChange={(value) => setStore(value.toString())}>
                {getStores().map(([key, store]) => (
                    <Select.Option key={key} value={store.key} disabled={key.includes('Foot')}>
                        {store.name}
                    </Select.Option>
                ))}
            </Select>
        </Modal>
    );
};

export default AddTaskGroupModal;
