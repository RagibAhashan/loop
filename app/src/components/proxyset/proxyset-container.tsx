import { ProxySetChannel } from '@core/IpcChannels';
import { ProxySetViewData } from '@core/ProxySet';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddProxySetModal from './add-proxyset-modal';
import ProxySetList from './proxyset-list';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const ProxySetContainer: React.FunctionComponent<Props> = () => {
    const [proxySets, setProxySets] = useState<ProxySetViewData[]>([]);
    const [isOpen, setOpen] = useState<boolean>(false);

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [currentProfileName, setCurrentProfileName] = useState<string>();

    useEffect(() => {
        window.ElectronBridge.invoke(ProxySetChannel.getAllProxySets).then((data: ProxySetViewData[]) => {
            setProxySets(data);
        });

        window.ElectronBridge.on(ProxySetChannel.proxySetUpdated, handleProxySetUpdated);
        window.ElectronBridge.on(ProxySetChannel.proxySetError, handleProxySetError);

        return () => {
            window.ElectronBridge.removeAllListeners(ProxySetChannel.proxySetUpdated);
            window.ElectronBridge.removeAllListeners(ProxySetChannel.proxySetError);
        };
    }, []);

    const handleProxySetUpdated = (_, proxySets: ProxySetViewData[], msg: string) => {
        setProxySets(proxySets);
        message.success(msg, 1);
    };

    const handleProxySetError = (_, msg: string) => {
        message.error(msg, 1);
    };

    const handleAddProxySet = () => {
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
            <Button style={{ marginBottom: 10 }} onClick={handleAddProxySet}>
                Add Proxy Set
            </Button>

            <ProxySetList proxySets={proxySets}> </ProxySetList>
            <AddProxySetModal isOpen={isOpen} setOpen={setOpen}></AddProxySetModal>
        </div>
    );
};

export default ProxySetContainer;
