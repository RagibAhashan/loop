import { ProxySetChannel } from '@core/IpcChannels';
import { IProxySet } from '@core/ProxySet';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProxySetModal from './AddProxySetModal';
import ProxyList from './ProxySetList';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const ProxyContainer: React.FunctionComponent<Props> = () => {
    const [proxySets, setProxySets] = useState<IProxySet[]>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [currentProfileName, setCurrentProfileName] = useState<string>();

    const handleProxySetUpdated = (_, proxySets: IProxySet[]) => {
        setProxySets(proxySets);
        message.success('Proxy Set Created');
    };

    const handleProxySetError = (_) => {
        message.error('Proxy Set Already Exists');
    };

    const handleAddProxySet = () => {
        setShowAddModal(true);
    };

    useEffect(() => {
        window.ElectronBridge.invoke(ProxySetChannel.getAllProxySets).then((data: IProxySet[]) => {
            setProxySets(data);
        });

        window.ElectronBridge.on(ProxySetChannel.proxySetUpdated, handleProxySetUpdated);
        window.ElectronBridge.on(ProxySetChannel.proxySetError, handleProxySetError);

        return () => {
            window.ElectronBridge.removeListener(ProxySetChannel.proxySetUpdated, handleProxySetUpdated);
            window.ElectronBridge.removeListener(ProxySetChannel.proxySetError, handleProxySetError);
        };
    }, []);

    return (
        <div>
            <Button style={{ marginBottom: 10 }} onClick={handleAddProxySet}>
                Add Proxy Set
            </Button>

            <AddProxySetModal showModal={showAddModal} setShowModal={setShowAddModal}></AddProxySetModal>
            <ProxyList proxySets={proxySets}></ProxyList>
        </div>
    );
};

export default ProxyContainer;
