import { CloseCircleOutlined } from '@ant-design/icons';
import Editable from '@components/base/editable';
import { ProxyGroupChannel } from '@core/ipc-channels';
import { ProxyGroupViewData } from '@core/proxy-group';
import { Button } from 'antd';
import React from 'react';

interface Props {
    proxySet: ProxyGroupViewData;
    selectedProxyGroup: ProxyGroupViewData | undefined;
}

const ProxyGroup: React.FunctionComponent<Props> = (props) => {
    const { proxySet, selectedProxyGroup } = props;

    const isSelected = selectedProxyGroup ? proxySet.id === selectedProxyGroup.id : false;

    const handleClickProxyGroup = () => {
        window.ElectronBridge.send(ProxyGroupChannel.getProxyGroupProxies, proxySet.id);
    };
    const handleRemoveProxyGroup = (event) => {
        window.ElectronBridge.send(ProxyGroupChannel.removeProxyGroup, proxySet.id);
        event.stopPropagation();
    };

    const handleProxyGroupNameEdit = (value: string) => {
        window.ElectronBridge.send(ProxyGroupChannel.editProxyGroupName, proxySet.id, value);
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
            onClick={handleClickProxyGroup}
        >
            <div>
                <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={handleRemoveProxyGroup} />
            </div>
            <div>
                <Editable value={proxySet.name} onSubmit={handleProxyGroupNameEdit} />
            </div>
        </div>
    );
};

export default ProxyGroup;
