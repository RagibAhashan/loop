import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space, TimePicker } from 'antd';
import React from 'react';
const { Option } = Select;

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: 'Required!',
    types: {
        email: '${name} is not a valid email!',
        number: '${name} is not a valid number!',
    },
    number: {
        range: '${name} must be 3 digits or less.',
    },
};

const format = 'HH:mm';

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

const buttonStyle: React.CSSProperties = {
    width: '20%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const getProfiles = () => {
    const profilesTemp: any = [];
    let profs: any = localStorage.getItem('profiles');

    if (profs) {
        profs = JSON.parse(profs);
        if (profs) {
            profs.forEach((p: any) => {
                profilesTemp.push({
                    label: p['profile'].toString(),
                    value: p['profile'].toString(),
                });
            });
        }
    }

    return profilesTemp;
};

const NewTaskModal = (props: any) => {
    const { store, addTasks, proxies, visible, cancelTaskModal } = props;

    const onFinishForm = (data: any) => {
        addTasks(data);
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
                width={700}
            >
                <Form onFinish={onFinishForm} validateMessages={validateMessages}>
                    <Form.Item name={['task', 'keyword']} rules={[{ required: true }]}>
                        <Input placeholder="keyword" />
                    </Form.Item>

                    <Row>
                        <Col style={{}}>
                            <Form.Item name={['task', 'startdate']} rules={[{ required: true }]}>
                                <DatePicker />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: '10px', width: '30%' }}>
                            <Form.Item style={{ width: '100%' }} name={['task', 'starttime']} rules={[{ required: true }]}>
                                <TimePicker style={{ width: '100%' }} format={format} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: '10px', width: '46%' }}>
                            <Form.Item name={['task', 'profile']} rules={[{ required: true }]}>
                                <Select style={{ width: '100%' }} placeholder="Profile" allowClear options={getProfiles()} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col style={{ width: '50%' }}>
                            <Form.Item name={['task', 'sizes']} rules={[{ required: true }]}>
                                <Select style={{ width: '100%%' }} placeholder="Size" mode="multiple" allowClear>
                                    {allSizes}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col style={{ marginLeft: '1%', width: '49%' }}>
                            <Form.Item name={['task', 'proxyset']} rules={[{ required: false }]}>
                                <Select style={{ width: '100%' }} placeholder="Proxy Set" allowClear options={proxies} defaultValue={'Localhost'} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Space>
                            <Col>
                                <Form.Item name={['task', 'monitordelay']} rules={[{ required: true }]}>
                                    <Input placeholder="Monitor delay in milliseconds" type="number" />
                                </Form.Item>
                            </Col>

                            <Col>
                                <Form.Item name={['task', 'retrydelay']} rules={[{ required: true }]}>
                                    <Input placeholder="Retry delay" type="number" />
                                </Form.Item>
                            </Col>
                        </Space>
                    </Row>

                    <Form.Item style={{ width: '40%' }} name={['task', 'quantity']} label="Number of tasks" rules={[{ required: true }]}>
                        <Input placeholder="Quantity" type="number" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ ...buttonStyle, float: 'right' }}>
                            Add tasks
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default NewTaskModal;
