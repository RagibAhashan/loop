// import { InboxOutlined } from '@ant-design/icons';
import { ProxySetChannel } from '@core/IpcChannels';
import { Button, Modal, Tabs } from 'antd';
import React from 'react';
import CopyProxy from './CopyProxy';
import UploadProxy from './UploadProxy';

const { TabPane } = Tabs;

interface Props {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedProxySetName: string;
}

const AddProxyModal: React.FunctionComponent<Props> = (props) => {
    const { showModal, setShowModal, selectedProxySetName } = props;

    const onAddProxies = (proxies: string[]) => {
        console.log('adding proxies', proxies);
        window.ElectronBridge.send(ProxySetChannel.addProxyToSet, selectedProxySetName, proxies);
        setShowModal(false);
    };

    return (
        <div>
            <Modal
                title="Add proxies to set"
                centered
                visible={showModal}
                okText="Create"
                onCancel={() => setShowModal(false)}
                footer={[
                    <Button form="prForm" key="submit" htmlType="submit">
                        Add Proxies
                    </Button>,
                ]}
            >
                <Tabs defaultActiveKey="file" style={{ backgroundColor: '#282c31', height: '350px' }}>
                    <TabPane tab={'Upload'} key={'file'}>
                        <UploadProxy onAddProxies={onAddProxies}></UploadProxy>
                    </TabPane>

                    <TabPane tab={'Copy Paste'} key={'copy'}>
                        <CopyProxy onAddProxies={onAddProxies}></CopyProxy>
                    </TabPane>
                </Tabs>
            </Modal>
        </div>
    );
};

export default AddProxyModal;
