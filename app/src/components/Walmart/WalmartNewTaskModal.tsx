import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';
import { WalmartTaskData } from '../../interfaces/TaskInterfaces';

interface Props {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onAdd: (data: WalmartTaskData, quantity: number) => void;
    proxySets: IProxySet[];
    profiles: IProfile[];
}
const validateMessages = {
    required: '',
};

const GUTTER: [number, number] = [16, 0];

const buttonStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const WalmartNewTaskModal: React.FunctionComponent<Props> = (props) => {
    const { showModal, setShowModal, onAdd, profiles, proxySets } = props;

    const [quantity, setQuantity] = useState(1);
    const [form] = Form.useForm<WalmartTaskData>();

    let optionsProfiles = profiles.map((profile) => {
        return { label: profile.profileName, value: profile.profileName };
    });

    let proxiesOptions: any = proxySets.map((proxySet) => {
        return { label: proxySet.name, value: proxySet.name };
    });

    proxiesOptions = [...proxiesOptions, { label: 'No Proxies', value: null }];
    optionsProfiles = [...optionsProfiles, { label: 'No Profile', value: null }];

    const onFinishForm = async (data: WalmartTaskData) => {
        console.log('adding task data walmart', data);
        onAdd(data, quantity);
    };

    return (
        <>
            <Modal
                title={'Add a New Task'}
                centered
                visible={showModal}
                onCancel={() => setShowModal(false)}
                okText="Create tasks"
                footer={false}
                width={900}
            >
                <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                    <Form form={form} onFinish={onFinishForm} validateMessages={validateMessages}>
                        <Row gutter={GUTTER}>
                            <Col span={12}>
                                <Form.Item name="productSKU" rules={[{ required: true }]}>
                                    <Input placeholder="Product SKU"></Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="offerId" rules={[{ required: true }]}>
                                    <Input placeholder="Offer ID"></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={GUTTER}>
                            <Col span={12}>
                                <Form.Item name="profileName" rules={[{ required: false }]}>
                                    <Select placeholder="Profile" allowClear options={optionsProfiles} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="proxySet" rules={[{ required: false }]} initialValue={null}>
                                    <Select style={{ width: '100%' }} placeholder="Proxy Set" allowClear options={proxiesOptions} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={GUTTER}>
                            <Col span={8}>
                                <Form.Item name="productQuantity" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} placeholder="Product Quantity" value={1} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="retryDelay" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} placeholder="Retry delay" />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item rules={[{ required: true }]}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        value={quantity}
                                        placeholder="Task Quantity"
                                        onChange={(value) => setQuantity(value)}
                                    />
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

export default WalmartNewTaskModal;
