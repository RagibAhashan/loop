import { getAccountStores } from '@constants/stores';
import { accountGroupPrefix } from '@core/account-group';
import { generateId } from '@core/helpers';
import { AccountGroupChannel } from '@core/ipc-channels';
import { Button, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    setOpen: (valuse: boolean) => void;
}

const GUTTER: [number, number] = [16, 0];

const AddAccountGroupModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen } = props;

    const [name, setName] = useState('New Account Group');
    const [store, setStore] = useState('');

    const onSubmit = () => {
        window.ElectronBridge.send(AccountGroupChannel.addAccountGroup, generateId(accountGroupPrefix), name, store);
        setOpen(false);
    };

    const onStoreChange = (value: string) => {
        if (!value) return;

        setStore(value);
    };

    return (
        <Modal title={'New Account Group'} visible={isOpen} onCancel={() => setOpen(false)} footer={<Button onClick={onSubmit}>Add</Button>}>
            <Input id="groupName" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <Select placeholder="Select store" onChange={onStoreChange}>
                {getAccountStores().map(([key, store]) => (
                    <Select.Option key={key} value={key}>
                        {store.name}
                    </Select.Option>
                ))}
            </Select>
        </Modal>
    );
};

export default AddAccountGroupModal;
