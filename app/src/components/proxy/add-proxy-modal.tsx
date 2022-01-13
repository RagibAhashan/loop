import { generateId } from '@core/helpers';
import { ProxyGroupChannel } from '@core/ipc-channels';
import { ProxyFormData, proxyPrefix } from '@core/proxy';
import { ProxyGroupViewData } from '@core/proxy-group';
import { Modal, Tabs } from 'antd';
import React, { useState } from 'react';
import CopyProxy from './copy-proxy';
import UploadProxy from './upload-proxy';

const { TabPane } = Tabs;

interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    selectedProxyGroup: ProxyGroupViewData;
}
const uploadTabKey = 'uploadProxy';
const copyTabKey = 'copyPaste';

const AddProxyModal: React.FunctionComponent<Props> = (props) => {
    const { isOpen, setOpen, selectedProxyGroup } = props;

    const [tabKey, setTabKey] = useState('uploadProxy');

    const onAddProxies = (proxies: string[]) => {
        const proxyDatas: ProxyFormData[] = proxies.map((proxy) => {
            return { id: generateId(proxyPrefix), proxy };
        });

        window.ElectronBridge.send(ProxyGroupChannel.addProxyToSet, selectedProxyGroup.id, proxyDatas);
        setOpen(false);
    };

    return (
        <div>
            <Modal title={'New Proxy'} visible={isOpen} onCancel={() => setOpen(false)} footer={null} destroyOnClose>
                <Tabs style={{ backgroundColor: '#282c31', height: '350px' }} defaultActiveKey={uploadTabKey} onChange={setTabKey}>
                    <TabPane tab="Upload" key={uploadTabKey}>
                        <UploadProxy onAddProxies={onAddProxies}></UploadProxy>
                    </TabPane>
                    <TabPane tab="Copy Paste" key={copyTabKey}>
                        <CopyProxy onAddProxies={onAddProxies}></CopyProxy>
                    </TabPane>
                </Tabs>
            </Modal>
        </div>
    );
};

export default AddProxyModal;