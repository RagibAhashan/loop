import { ProxyGroupChannel } from '@core/ipc-channels';
import { ProxyGroupViewData } from '@core/proxy-group';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProxyGroupModal from './add-proxy-group-modal';
import ProxyGroupList from './proxy-group-list';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const ProxyGroupContainer: React.FunctionComponent<Props> = () => {
    const [proxyGroups, setProxyGroups] = useState<ProxyGroupViewData[]>([]);
    const [isOpen, setOpen] = useState<boolean>(false);

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [currentProfileName, setCurrentProfileName] = useState<string>();

    useEffect(() => {
        window.ElectronBridge.invoke(ProxyGroupChannel.getAllProxyGroups).then((data: ProxyGroupViewData[]) => {
            setProxyGroups(data);
        });

        window.ElectronBridge.on(ProxyGroupChannel.proxySetUpdated, handleProxyGroupUpdated);
        window.ElectronBridge.on(ProxyGroupChannel.proxySetError, handleProxyGroupError);

        return () => {
            window.ElectronBridge.removeAllListeners(ProxyGroupChannel.proxySetUpdated);
            window.ElectronBridge.removeAllListeners(ProxyGroupChannel.proxySetError);
        };
    }, []);

    const handleProxyGroupUpdated = (_, proxyGroups: ProxyGroupViewData[], msg?: string) => {
        setProxyGroups(proxyGroups);
        if (msg) message.success(msg, 1);
    };

    const handleProxyGroupError = (_, msg: string) => {
        message.error(msg, 1);
    };

    const handleAddProxyGroup = () => {
        setOpen(true);
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
            <Button style={{ marginBottom: 10 }} onClick={handleAddProxyGroup}>
                Add Proxy Set
            </Button>

            <ProxyGroupList proxyGroups={proxyGroups}> </ProxyGroupList>
            <AddProxyGroupModal isOpen={isOpen} setOpen={setOpen}></AddProxyGroupModal>
        </div>
    );
};

export default ProxyGroupContainer;
