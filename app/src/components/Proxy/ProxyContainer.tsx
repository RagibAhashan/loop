import { ProxySetChannel } from '@core/IpcChannels';
import { Proxy } from '@core/Proxy';
import { Button, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProxyModal from './AddProxyModal';
import ProxyHeaders from './ProxyHeader';
import ProxyList from './ProxyList';

const { Title } = Typography;

const ProxyContainer: React.FunctionComponent = () => {
    const [proxies, setProxies] = useState<Proxy[]>([]);
    const [selectedProxySetName, setSelectedProxySetName] = useState(null);

    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    useEffect(() => {
        window.ElectronBridge.on(ProxySetChannel.onSelectedProxySet, handleOnProxySetSelected);
        window.ElectronBridge.on(ProxySetChannel.proxiesUpdated, handleOnProxisUpdated);

        return () => {
            window.ElectronBridge.removeListener(ProxySetChannel.onSelectedProxySet, handleOnProxySetSelected);
            window.ElectronBridge.removeListener(ProxySetChannel.proxiesUpdated, handleOnProxisUpdated);
        };
    }, []);

    const handleOnProxySetSelected = (_, proxySetName: string, proxies: Proxy[]) => {
        setProxies(proxies);
        setSelectedProxySetName(proxySetName);
    };

    const handleOnProxisUpdated = (_, proxies: Proxy[]) => {
        setProxies(proxies);
    };

    const handleAddProxies = () => {
        setShowAddModal(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto', padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3}>Proxies</Title>
                {selectedProxySetName ? <Button onClick={handleAddProxies}> Add Proxies </Button> : null}
            </div>
            <ProxyHeaders></ProxyHeaders>
            <ProxyList proxies={proxies} selectedProxySetName={selectedProxySetName}></ProxyList>
            <AddProxyModal showModal={showAddModal} setShowModal={setShowAddModal} selectedProxySetName={selectedProxySetName}></AddProxyModal>
        </div>
    );
};

export default ProxyContainer;
