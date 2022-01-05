import { ProxySetChannel } from '@core/IpcChannels';
import { ProxySetViewData } from '@core/ProxySet';
import React, { useEffect, useState } from 'react';
import ProxySet from './proxyset';

interface Props {
    proxySets: ProxySetViewData[];
}

const ProxySetList: React.FunctionComponent<Props> = (props) => {
    const { proxySets } = props;
    const [selectedProxySet, setSelectedProxySet] = useState(null);

    useEffect(() => {
        window.ElectronBridge.on(ProxySetChannel.onSelectedProxySet, handleOnProxySetSelected);

        return () => {
            window.ElectronBridge.removeAllListeners(ProxySetChannel.onSelectedProxySet);
        };
    }, []);

    const handleOnProxySetSelected = (_, proxySet: ProxySetViewData) => {
        setSelectedProxySet(proxySet);
    };

    return (
        <div>
            {proxySets.map((proxySet) => (
                <ProxySet key={proxySet.id} proxySet={proxySet} selectedProxySet={selectedProxySet}></ProxySet>
            ))}
        </div>
    );
};

export default ProxySetList;
