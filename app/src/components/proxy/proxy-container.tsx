import { ProxyGroupChannel } from '@core/ipc-channels';
import { ProxyViewData } from '@core/proxy';
import { ProxyGroupViewData } from '@core/proxy-group';
import { Button, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProxyModal from './add-proxy-modal';
import ProxyHeaders from './proxy-headers';
import ProxyList from './proxy-list';

const { Title } = Typography;

export interface State {
    proxies: ProxyViewData[];
    selectedProxyGroup: ProxyGroupViewData | undefined;
}

const ProxyContainer: React.FunctionComponent = () => {
    const [proxyContainerState, setProxyContainerState] = useState<State>({ proxies: [], selectedProxyGroup: undefined });

    const [isOpen, setOpen] = useState(false);
    useEffect(() => {
        window.ElectronBridge.on(ProxyGroupChannel.onProxyGroupSelected, handleOnProxyGroupSelected);
        window.ElectronBridge.on(ProxyGroupChannel.proxiesUpdated, handleOnProxisUpdated);

        return () => {
            window.ElectronBridge.removeAllListeners(ProxyGroupChannel.onProxyGroupSelected);
            window.ElectronBridge.removeAllListeners(ProxyGroupChannel.proxiesUpdated);
        };
    }, []);

    const handleOnProxyGroupSelected = (_, proxySet: ProxyGroupViewData, proxies: ProxyViewData[]) => {
        setProxyContainerState({ proxies: proxies, selectedProxyGroup: proxySet });
    };

    const handleOnProxisUpdated = (_, proxies: ProxyViewData[]) => {
        setProxyContainerState((prev) => {
            return { proxies: proxies, selectedProxyGroup: prev.selectedProxyGroup };
        });
    };

    const handleAddProxies = () => {
        setOpen(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto', padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3}>Proxies</Title>
                {proxyContainerState.selectedProxyGroup ? <Button onClick={handleAddProxies}> Add Proxies </Button> : null}
            </div>

            {proxyContainerState.selectedProxyGroup && (
                <>
                    <ProxyHeaders></ProxyHeaders>
                    <ProxyList proxies={proxyContainerState.proxies} selectedProxyGroup={proxyContainerState.selectedProxyGroup}></ProxyList>
                    <AddProxyModal isOpen={isOpen} setOpen={setOpen} selectedProxyGroup={proxyContainerState.selectedProxyGroup}></AddProxyModal>
                </>
            )}
        </div>
    );
};

export default ProxyContainer;
