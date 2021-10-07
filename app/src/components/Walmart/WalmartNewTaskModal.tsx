import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { WalmartTaskData } from '../../interfaces/TaskInterfaces';
import { getProfiles } from '../../services/Profile/ProfileService';
import { getProxySets } from '../../services/Proxy/ProxyService';
const validateMessages = {
    required: '',
};

const GUTTER: [number, number] = [16, 0];

const buttonStyle: React.CSSProperties = {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const WalmartNewTaskModal = (props: any) => {
    const { visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (data: WalmartTaskData, quantity: number) => void } = props;

    const [quantity, setQuantity] = useState(1);

    const [form] = Form.useForm<WalmartTaskData>();

    const profiles = useSelector(getProfiles);
    const optionsProfiles = Object.entries(profiles).map(([key, profile]) => {
        return { label: profile.name, value: profile.name };
    });

    const proxies = useSelector(getProxySets);
    let proxiesOptions: any = Object.keys(proxies).map((proxySetName) => {
        return { label: proxySetName, value: proxySetName };
    });
    proxiesOptions = [...proxiesOptions, { label: 'No Proxies', value: null }];

    const getProfileByname = (profName: string) => profiles[profName];

    const onFinishForm = async (data: WalmartTaskData) => {
        const setData = await setTaskData(data);
        onAdd(setData, quantity);
    };

    const setTaskData = async (data: WalmartTaskData) => {
        const currProf = getProfileByname(data.profileName);

        data = { ...data, profile: { ...currProf } };

        return data;
    };

    return (
        <>
            <Modal title={'Add a New Task'} centered visible={visible} onCancel={onClose} okText="Create tasks" footer={false} width={900}>
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
                                <Form.Item name="profileName" rules={[{ required: true }]}>
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
                            <Col span={12}>
                                <Form.Item name="retryDelay" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} placeholder="Retry delay" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item rules={[{ required: true }]}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        value={quantity}
                                        placeholder="Quantity"
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
