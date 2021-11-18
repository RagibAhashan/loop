import { ProxySetChannel } from '@core/IpcChannels';
import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

interface Props {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProxySetModal: React.FunctionComponent<Props> = (props) => {
    const { showModal, setShowModal } = props;

    const onAddProxySet = (values: { name: string }) => {
        window.ElectronBridge.send(ProxySetChannel.addProxySet, values.name);
        setShowModal(false);
    };

    return (
        <div>
            <Modal
                title={'Add a New Proxy Set'}
                centered
                visible={showModal}
                onCancel={() => setShowModal(false)}
                okText="Create Proxy Set"
                footer={[
                    <Button form="psForm" key="submit" htmlType="submit">
                        Create Proxy Set
                    </Button>,
                ]}
                width={900}
            >
                <Form id="psForm" onFinish={onAddProxySet}>
                    <Form.Item name="name" rules={[{ required: true, message: 'Please input the name of the set to add!' }]}>
                        <Input placeholder="Set Name" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddProxySetModal;
