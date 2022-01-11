import { ProxyGroupChannel } from '@core/ipc-channels';
import { ProxyGroupViewData } from '@core/proxy-group';
import React, { useEffect, useState } from 'react';
import ProxyGroup from './proxy-group';

interface Props {
    proxyGroups: ProxyGroupViewData[];
}

const ProxyGroupList: React.FunctionComponent<Props> = (props) => {
    const { proxyGroups } = props;
    const [selectedProxyGroup, setSelectedProxyGroup] = useState<ProxyGroupViewData | undefined>(undefined);

    useEffect(() => {
        window.ElectronBridge.on(ProxyGroupChannel.onProxyGroupSelected, handleOnProxyGroupSelected);

        return () => {
            window.ElectronBridge.removeAllListeners(ProxyGroupChannel.onProxyGroupSelected);
        };
    }, []);

    const handleOnProxyGroupSelected = (_, proxySet: ProxyGroupViewData) => {
        setSelectedProxyGroup(proxySet);
    };

    return (
        <div>
            {proxyGroups.map((proxySet) => (
                <ProxyGroup key={proxySet.id} proxySet={proxySet} selectedProxyGroup={selectedProxyGroup}></ProxyGroup>
            ))}
        </div>
    );
};

export default ProxyGroupList;
