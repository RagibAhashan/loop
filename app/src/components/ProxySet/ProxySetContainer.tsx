import { ProxySetChannel } from '@core/IpcChannels';
import { IProxySet } from '@core/ProxySet';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProxySetModal from './AddProxySetModal';
import ProxySetList from './ProxySetList';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const ProxySetContainer: React.FunctionComponent<Props> = () => {
    const [proxySets, setProxySets] = useState<IProxySet[]>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [currentProfileName, setCurrentProfileName] = useState<string>();

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

    const handleProxySetUpdated = (_, proxySets: IProxySet[], msg: string) => {
        setProxySets(proxySets);
        message.success(msg);
    };

    const handleProxySetError = (_, msg: string) => {
        message.error(msg);
    };

    const handleAddProxySet = () => {
        setShowAddModal(true);
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
            <Button style={{ marginBottom: 10 }} onClick={handleAddProxySet}>
                Add Proxy Set
            </Button>

            <ProxySetList proxySets={proxySets}> </ProxySetList>
            <AddProxySetModal showModal={showAddModal} setShowModal={setShowAddModal}></AddProxySetModal>
        </div>
    );
};

export default ProxySetContainer;
