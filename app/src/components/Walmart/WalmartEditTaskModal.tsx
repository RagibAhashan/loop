import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { WalmartTaskData } from '../../interfaces/TaskInterfaces';
import { getProfiles } from '../../services/Profile/ProfileService';
import { getProxySets } from '../../services/Proxy/ProxyService';

const validateMessages = {
    required: 'Required!',
};
const GUTTER: [number, number] = [16, 0];

export const WalmartEditTaskModal = (props: any) => {
    const {
        visible,
        onClose,
        onEdit,
        task,
    }: { visible: boolean; onClose: () => void; onEdit: (newVal: WalmartTaskData) => void; task: WalmartTaskData } = props;
    const [form] = useForm<WalmartTaskData>();

    const profiles = useSelector(getProfiles);
    const optionProfiles = Object.entries(profiles).map(([key, profile]) => {
        return { label: profile.name, value: profile.name };
    });

    const profileByName = (profileName: string) => profiles[profileName];

    const proxies = useSelector(getProxySets);
    const proxiesOptions = Object.keys(proxies).map((proxySetName) => {
        return { label: proxySetName, value: proxySetName };
    });

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(task);
    });

    const title = () => {
        if (!task) return '';
        return Object.keys(task).length > 0 ? 'Edit Task' : 'Mass Edit All';
    };

    const removeUndefined = () => {
        const values = form.getFieldsValue();
        Object.keys(values).forEach((key) => values[key] === undefined && delete values[key]);
        return values;
    };

    const handleOnEdit = (newTaskValues: WalmartTaskData) => {
        if (newTaskValues.profileName !== task.profileName) {
            newTaskValues.profile = profileByName(newTaskValues.profileName);
        }

        onEdit(newTaskValues);
    };

    return (
        <Modal
            title={title()}
            centered
            visible={visible}
            onOk={() => {
                Object.keys(task).length > 0
                    ? form
                          .validateFields()
                          .then((values) => {
                              //   form.resetFields();
                              handleOnEdit(values);
                          })
                          .catch((err) => {})
                    : handleOnEdit(removeUndefined());
            }}
            onCancel={onClose}
            okText="Edit"
            cancelText="Cancel"
            width={600}
        >
            <Form form={form} validateMessages={validateMessages}>
                <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                    <Row gutter={GUTTER}>
                        <Col span={24}>
                            <Form.Item name="productURL" rules={[{ required: true }]}>
                                <Input placeholder="Product URL"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <Form.Item name="profileName" rules={[{ required: true }]}>
                                <Select placeholder="Profile" allowClear options={optionProfiles} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="proxySet" rules={[{ required: false }]}>
                                <Select style={{ width: '100%' }} placeholder="Proxy Set" allowClear options={proxiesOptions} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <Form.Item name="retryDelay" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} placeholder="Retry delay (ms)" />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            </Form>
        </Modal>
    );
};

export default WalmartEditTaskModal;
