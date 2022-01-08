import { CloseCircleOutlined } from '@ant-design/icons';
import Editable from '@components/base/editable';
import { ProxySetChannel } from '@core/ipc-channels';
import { ProxySetViewData } from '@core/proxyset';
import { Button } from 'antd';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
    proxySet: ProxySetViewData;
    selectedProxySet: ProxySetViewData;
}

const ProxySet: React.FunctionComponent<Props> = (props) => {
    const { proxySet, selectedProxySet } = props;

    const isSelected = selectedProxySet ? proxySet.id === selectedProxySet.id : false;

    const selectedStyle = isSelected ? { borderColor: '#9ecaed', boxShadow: '0 0 10px #9ecaed' } : undefined;

    const handleClickProxySet = () => {
        window.ElectronBridge.send(ProxySetChannel.getProxySetProxies, proxySet.id);
    };
    const handleRemoveProxySet = (event) => {
        window.ElectronBridge.send(ProxySetChannel.removeProxySet, proxySet.id);
        event.stopPropagation();
    };

    const handleProxySetNameEdit = (value: string) => {
        window.ElectronBridge.send(ProxySetChannel.editProxySetName, proxySet.id, value);
    };

    return (
        <div
            style={{
                width: '190px',
                height: '100px',
                backgroundColor: '#212427',
                padding: 10,
                margin: 10,
                borderRadius: 5,
                border: isSelected ? '1px solid rgb(177 142 15 / 92%)' : undefined,
            }}
            onClick={handleClickProxySet}
        >
            <div>
                <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={handleRemoveProxySet} />
            </div>
            <div>
                <Editable value={proxySet.name} onSubmit={handleProxySetNameEdit} />
            </div>
        </div>
    );
};

export default ProxySet;
