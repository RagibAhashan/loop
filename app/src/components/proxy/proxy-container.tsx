import { ProxySetChannel } from '@core/ipc-channels';
import { ProxyViewData } from '@core/proxy';
import { ProxySetViewData } from '@core/proxyset';
import { Button, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProxyModal from './add-proxy-modal';
import ProxyHeaders from './proxy-headers';
import ProxyList from './proxy-list';

const { Title } = Typography;

export interface State {
    proxies: ProxyViewData[];
    selectedProxySet: ProxySetViewData;
}

const ProxyContainer: React.FunctionComponent = () => {
    const [proxyContainerState, setProxyContainerState] = useState<State>({ proxies: [], selectedProxySet: undefined });

    const [isOpen, setOpen] = useState(false);
    useEffect(() => {
        window.ElectronBridge.on(ProxySetChannel.onProxySetSelected, handleOnProxySetSelected);
        window.ElectronBridge.on(ProxySetChannel.proxiesUpdated, handleOnProxisUpdated);

        return () => {
            window.ElectronBridge.removeAllListeners(ProxySetChannel.onProxySetSelected);
            window.ElectronBridge.removeAllListeners(ProxySetChannel.proxiesUpdated);
        };
    }, []);

    const handleOnProxySetSelected = (_, proxySet: ProxySetViewData, proxies: ProxyViewData[]) => {
        setProxyContainerState({ proxies: proxies, selectedProxySet: proxySet });
    };

    const handleOnProxisUpdated = (_, proxies: ProxyViewData[]) => {
        setProxyContainerState((prev) => {
            return { proxies: proxies, selectedProxySet: prev.selectedProxySet };
        });
    };

    const handleAddProxies = () => {
        setOpen(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto', padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3}>Proxies</Title>
                {proxyContainerState.selectedProxySet ? <Button onClick={handleAddProxies}> Add Proxies </Button> : null}
            </div>
            <ProxyHeaders></ProxyHeaders>
            <ProxyList proxies={proxyContainerState.proxies} selectedProxySet={proxyContainerState.selectedProxySet}></ProxyList>
            <AddProxyModal isOpen={isOpen} setOpen={setOpen} selectedProxySet={proxyContainerState.selectedProxySet}></AddProxyModal>
        </div>
    );
};

export default ProxyContainer;
