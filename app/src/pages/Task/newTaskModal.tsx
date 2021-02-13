import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, TimePicker } from 'antd';
import React, { Fragment, useState } from 'react';
import { getProfiles, getProxies, getSizes } from '../../services/TaskService';

const validateMessages = {
    required: '',
};

const GUTTER: [number, number] = [16, 0];

const buttonStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const format = 'HH:mm';

const NewTaskModal = (props: any) => {
    const { store, addTasks, visible, cancelTaskModal } = props;

    const [manualTime, setManualTime] = useState(true);

    const [form] = Form.useForm();

    const onFinishForm = (data: any) => {
        addTasks(data);
    };

    const onManualTimeChange = (e: any) => {
        setManualTime((prev) => (prev = e.target.checked));
    };

    const renderTime = () => {
        return manualTime ? (
            <Col span={8}></Col>
        ) : (
            <Fragment>
                <Col span={4}>
                    <Form.Item name="startDate" rules={[{ required: true }]}>
                        <DatePicker disabled />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="startTime" rules={[{ required: true }]}>
                        <TimePicker disabled format={format} />
                    </Form.Item>
                </Col>
            </Fragment>
        );
    };

    return (
        <>
            <Modal
                title={store}
                centered
                visible={visible}
                onOk={() => addTasks}
                onCancel={() => cancelTaskModal()}
                okText="Create tasks"
                footer={false}
                width={900}
            >
                <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                    <Form form={form} onFinish={onFinishForm} validateMessages={validateMessages}>
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
                                <Form.Item name="proxySet" rules={[{ required: false }]} initialValue={null}>
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
                                    <InputNumber style={{ width: '100%' }} placeholder="Retry delay" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={GUTTER}>
                            <Col span={4}>
                                <Form.Item name="manualTime">
                                    <Checkbox onChange={onManualTimeChange} defaultChecked={manualTime}>
                                        <span>Manual Start</span>
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            {renderTime()}
                            <Col span={12}>
                                <Form.Item name="quantity" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} placeholder="Quantity" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={GUTTER}>
                            <Col span={18}>
                                <span></span>
                            </Col>

                            <Col span={6}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={buttonStyle}>
                                        Create Task
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default NewTaskModal;
