import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { TaskData } from '../../../interfaces/TaskInterfaces';
import { getProfiles, getProxies, getSizes } from '../../../services/TaskService';

const validateMessages = {
    required: 'Required!',
};
const GUTTER: [number, number] = [16, 0];

export const EditTaskModal = (props: any) => {
    const { visible, cancelEditModal, taskData }: { visible: boolean; cancelEditModal: any; confirmEdit: any; taskData: TaskData } = props;

    const [form] = useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(taskData);
    });

    const title = () => {
        return Object.keys(taskData).length > 0 ? 'Edit Task' : 'Mass Edit All';
    };

    const removeUndefined = () => {
        const values = form.getFieldsValue();
        Object.keys(values).forEach((key) => values[key] === undefined && delete values[key]);
        return values;
    };

    return (
        <Modal
            title={title()}
            centered
            visible={visible}
            onOk={() => {
                Object.keys(taskData).length > 0
                    ? form
                          .validateFields()
                          .then((values) => {
                              form.resetFields();
                              props.confirmEdit(values);
                          })
                          .catch((err) => {})
                    : props.confirmEdit(removeUndefined());
            }}
            onCancel={() => cancelEditModal()}
            okText="Edit"
            cancelText="Cancel"
            width={600}
        >
            <Form form={form} validateMessages={validateMessages}>
                <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                    <Row gutter={GUTTER}>
                        <Col span={24}>
                            <Form.Item name="productSKU" rules={[{ required: true }]}>
                                <Input placeholder="Product SKU"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <Form.Item name="profile" rules={[{ required: true }]}>
                                <Select placeholder="Profile" allowClear options={getProfiles()} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="proxySet" rules={[{ required: false }]}>
                                <Select style={{ width: '100%' }} placeholder="Proxy Set" allowClear options={getProxies()} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <Form.Item name="sizes" rules={[{ required: true }]}>
                                <Select placeholder="Size" mode="multiple" allowClear>
                                    {getSizes()}
                                </Select>
                            </Form.Item>
                        </Col>

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

export default EditTaskModal;
