import { generateId } from '@core/helpers';
import { ProxySetChannel } from '@core/ipc-channels';
import { proxySetPrefix } from '@core/proxyset';
import { Input, Modal } from 'antd';
import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
}

const AddProxySetModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen } = props;
    const [name, setName] = useState('New Proxy Set');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.ElectronBridge.send(ProxySetChannel.addProxySet, generateId(proxySetPrefix), name);
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

export default AddProxySetModal;
