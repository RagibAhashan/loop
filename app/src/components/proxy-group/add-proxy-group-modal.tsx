import { generateId } from '@core/helpers';
import { ProxyGroupChannel } from '@core/ipc-channels';
import { proxySetPrefix } from '@core/proxy-group';
import { Input, Modal } from 'antd';
import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
}

const AddProxyGroupModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen } = props;
    const [name, setName] = useState('New Proxy Set');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.ElectronBridge.send(ProxyGroupChannel.addProxyGroup, generateId(proxySetPrefix), name);
        setOpen(false);
    };

    return (
        <Modal title={'New Proxy Set'} visible={isOpen} onCancel={() => setOpen(false)} onOk={onSubmit} okButtonProps={{ disabled: !name.trim() }}>
            <label>
                Name
                <Input id="groupName" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
        </Modal>
    );
};

export default AddProxyGroupModal;
