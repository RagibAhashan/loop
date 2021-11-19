import { ProxySetChannel } from '@core/IpcChannels';
import { IProxySet } from '@core/ProxySet';
import React, { useEffect, useState } from 'react';
import ProxySet from './ProxySet';

interface Props {
    proxySets: IProxySet[];
}

const ProxySetList: React.FunctionComponent<Props> = (props) => {
    const { proxySets } = props;
    const [currentSelectedProxySet, setCurrentSelectedProxySet] = useState(null);

    useEffect(() => {
        window.ElectronBridge.on(ProxySetChannel.onSelectedProxySet, handleOnProxySetSelected);

        return () => {
            window.ElectronBridge.removeAllListeners(ProxySetChannel.onSelectedProxySet);
        };
    }, []);

    const handleOnProxySetSelected = (_, proxySetName: string) => {
        setCurrentSelectedProxySet(proxySetName);
    };

    return (
        <div>
            {proxySets.map((proxySet) => (
                <ProxySet key={proxySet.name} name={proxySet.name} selected={currentSelectedProxySet}></ProxySet>
            ))}
        </div>
    );
};

export default ProxySetList;
