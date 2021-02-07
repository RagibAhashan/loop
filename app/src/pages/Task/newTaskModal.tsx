import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, TimePicker, Badge, Descriptions } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
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

const GUTTER: [number, number] = [16, 0];

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

const buttonStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const format = 'HH:mm';

const getProfiles = () => {
    let profs: any = JSON.parse(localStorage.getItem('profiles') as string);
    if (!profs) return [];
    const profilesTemp: any = [];

    profs.forEach((p: any) => {
        profilesTemp.push({
            label: p['profile'].toString(),
            value: p['profile'].toString(),
        });
    });

    return profilesTemp;
};

const getProxies = (): any => {
    const proxiesOptions: any = [{ label: 'No Proxies', value: null }];
    let prox: any = JSON.parse(localStorage.getItem('proxies') as string);
    if (prox) {
        prox.forEach((set: any) => {
            proxiesOptions.push({
                label: `${set[0]} (${set[1].length} proxies)`,
                value: `${set[0]}`,
            });
        });
    }
    return proxiesOptions;
};

const NewTaskModal = (props: any) => {
    const { store, addTasks, visible, cancelTaskModal } = props;

    const [manualTime, setManualTime] = useState(true);
    const [productLink, setProductLink] = useState('');

    const [form] = Form.useForm();

    const onFinishForm = (data: any) => {
        console.log('DATAAAA', data);
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
                        <DatePicker />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="startTime" rules={[{ required: true }]}>
                        <TimePicker format={format} />
                    </Form.Item>
                </Col>
            </Fragment>
        );
    };

    const extractSKU = (link: string) => {
        const res = /\/([0-9]*).html/.exec(link);
        if (!res) {
            form.setFields([
                {
                    name: 'productSKU',
                    errors: ['Couldt not parse SKU'],
                },
            ]);
            return undefined;
        }

        console.log('extracted', res[1]);
        form.setFieldsValue({ productSKU: res[1] });
        return res[1];
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
                width={800}
            >
                <Form form={form} onFinish={onFinishForm} validateMessages={validateMessages}>
                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <Form.Item name="productLink" rules={[{ required: true }]}>
                                <Input placeholder="Product Link" type="text" onChange={(e) => extractSKU(e.target.value)} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="productSKU">
                                <Input disabled placeholder="Product SKU"></Input>
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
                            <Form.Item name="proxySet" rules={[{ required: false }]} initialValue={'No Proxies'}>
                                <Select style={{ width: '100%' }} placeholder="Proxy Set" allowClear options={getProxies()} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <Form.Item name="sizes" rules={[{ required: true }]}>
                                <Select placeholder="Size" mode="multiple" allowClear>
                                    {allSizes}
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
                                    Manual Start
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

                    <Row>
                        <Col span={21}></Col>

                        <Col span={3}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={buttonStyle}>
                                    Create
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default NewTaskModal;
