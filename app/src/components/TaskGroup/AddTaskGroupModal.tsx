import { STORES, StoreType } from '@constants/Stores';
import { TaskGroupChannel } from '@core/IpcChannels';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import React from 'react';
const { Option } = Select;

interface Props {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const GUTTER: [number, number] = [16, 0];

const AddTaskGroupModal: React.FunctionComponent<Props> = (props) => {
    const { showModal, setShowModal } = props;

    const onClose = () => {
        setShowModal(false);
    };

    const onAddTaskGroup = (values: { name: string; store: StoreType }) => {
        window.ElectronBridge.send(TaskGroupChannel.addTaskGroup, values.name, values.store);
        setShowModal(false);
    };

    return (
        <Modal
            title={'Add a New Group Task'}
            centered
            visible={showModal}
            onCancel={onClose}
            okText="Create Task Group"
            footer={[
                <Button form="tgForm" key="submit" htmlType="submit">
                    Create Task Group
                </Button>,
            ]}
            width={900}
        >
            <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                <Form id="tgForm" onFinish={onAddTaskGroup}>
                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <Form.Item name="name" rules={[{ required: true }]}>
                                <Input placeholder="Name"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="store" rules={[{ required: true }]}>
                                <Select placeholder="Select Store" style={{ width: 200, margin: 'auto' }}>
                                    {Object.entries(STORES).map(([storeKey, store]) => (
                                        <Option key={store.key} value={storeKey}>
                                            {store.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    );
};

export default AddTaskGroupModal;
