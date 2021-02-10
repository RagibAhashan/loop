import React, { useState } from 'react';
import { Modal, Button, Tabs, Input, Row, Col, Form, Divider, Select, Checkbox } from 'antd';
import Cards from 'react-credit-cards';
import { Option } from 'antd/lib/mentions';
import { COUNTRY, REGIONS } from '../../common/Regions';

const { TabPane } = Tabs;
type IObj = {
    [key: string]: any;
};
const ALL_REGIONS: IObj = REGIONS;

const validateMessages = {
    required: 'required',
};

const ROW_GUTTER: [number, number] = [8, 0];
const ROW_GUTTER_CC: [number, number] = [8, 0];
type focus = 'number' | 'cvc' | 'expiry' | 'name' | undefined;
const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};

const getYears = (): any => {
    const year = new Date().getFullYear();
    let years = [];
    for (let i = year; i < year + 15; i++) {
        years.push({
            value: i.toString(),
            label: i,
        });
    }
    return years;
};

const getMonths = (): any => {
    return [
        { value: '01', label: '01' },
        { value: '02', label: '02' },
        { value: '03', label: '03' },
        { value: '04', label: '04' },
        { value: '05', label: '05' },
        { value: '06', label: '06' },
        { value: '07', label: '07' },
        { value: '08', label: '08' },
        { value: '09', label: '09' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' },
    ];
};

const CreateNewProfileModal = (props: any) => {
    const { addProfile } = props;
    const [form] = Form.useForm();

    const [same, setSame] = useState(false);
    const [focused, setFocused] = useState<focus>(undefined);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [shipFirstName, setshipFirstName] = useState('');
    const [shipLastname, setshipLastName] = useState('');

    const [billFirstName, setFirstName] = useState('');
    const [billLastname, setLastName] = useState('');

    const [creditCard, setCreditCard] = useState('');
    const [cvc, setCvc] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const [country, setCountry] = useState('default');

    const callback = (key: any) => {
        console.log(key);
    };

    const handleOk = () => {
        setIsEditModalVisible(false);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
    };

    const changeMonth = (value: any) => {
        setMonth((prev) => (prev = value));
    };

    const changeYear = (value: any) => {
        setYear((prev) => (prev = value));
    };

    const onCountryChange = (iso: string) => {
        setCountry(iso);
        form.resetFields([['shipping', 'region']]);
    };

    const onFinish = (values: any) => {
        console.log(values);
        addProfile(values);
    };
    return (
        <div>
            <Button type="primary" onClick={() => setIsEditModalVisible(true)}>
                Create Profile
            </Button>
            <Modal
                centered
                title="Create a new profile"
                visible={isEditModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={false}
            >
                <Form form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                    <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                        <Tabs defaultActiveKey="1" onChange={callback}>
                            <TabPane tab="Profile and Shipping" key="1">
                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name="profile" rules={[{ required: true }]}>
                                            <Input placeholder={'Profile name'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'firstName']} rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'First name'}
                                                onChange={(e) => {
                                                    setshipFirstName((prev) => (prev = e.target.value));
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'lastName']} rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'Last name'}
                                                onChange={(e) => {
                                                    setshipLastName((prev) => (prev = e.target.value));
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'phone']} rules={[{ required: true }]}>
                                            <Input placeholder={'Phone'} type="number" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'email']} rules={[{ required: true }]}>
                                            <Input placeholder={'Email'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'address']} rules={[{ required: true }]}>
                                            <Input placeholder={'Address'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'country']} rules={[{ required: true }]}>
                                            <Select placeholder="Country" onChange={onCountryChange} allowClear>
                                                {Object.keys(COUNTRY).map((name) => (
                                                    <Option value={name}>{name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'region']} rules={[{ required: true }]}>
                                            <Select placeholder="Province/State" allowClear>
                                                {Object.entries(ALL_REGIONS[country]).map(([name, value]: [string, any]) => (
                                                    <Option value={name}>{name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'town']} rules={[{ required: true }]}>
                                            <Input placeholder={'City'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={['shipping', 'postalCode']} rules={[{ required: true }]}>
                                            <Input placeholder={'Postal Code/Zip Code'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </TabPane>

                            <TabPane tab="Payment Information" key="2">
                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'firstName']} rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'First name'}
                                                onChange={(e) => {
                                                    setFirstName((prev) => (prev = e.target.value));
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'lastName']} rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'Last name'}
                                                onChange={(e) => {
                                                    setLastName((prev) => (prev = e.target.value));
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'phone']} rules={[{ required: true }]}>
                                            <Input placeholder={'Phone'} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'email']} rules={[{ required: true, type: 'email' }]}>
                                            <Input placeholder={'email'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'address']} rules={[{ required: true }]}>
                                            <Input placeholder={'Address'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'country']} rules={[{ required: true }]}>
                                            <Select placeholder="Country" onChange={onCountryChange} allowClear>
                                                {Object.keys(COUNTRY).map((name) => (
                                                    <Option value={name}>{name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'region']} rules={[{ required: true }]}>
                                            <Select placeholder="Province/State" allowClear>
                                                {Object.entries(ALL_REGIONS[country]).map(([name, value]: [string, any]) => (
                                                    <Option value={name}>{name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'town']} rules={[{ required: true }]}>
                                            <Input placeholder={'City'} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'postalCode']} rules={[{ required: true }]}>
                                            <Input placeholder={'Postal Code/Zip Code'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item wrapperCol={{ ...layout.wrapperCol }} name="same" valuePropName="checked">
                                            <Checkbox
                                                checked={same}
                                                onChange={(e) => {
                                                    setSame(e.target.checked);
                                                }}
                                            >
                                                Same as shipping
                                            </Checkbox>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Divider> Enter your card </Divider>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        overflow: 'auto',
                                        // padding: 5,
                                        alignItems: 'center',
                                    }}
                                >
                                    <div style={{ marginRight: 10 }}>
                                        <Cards
                                            cvc={cvc}
                                            expiry={`${month}${year}`}
                                            focused={focused}
                                            name={same ? shipFirstName + ' ' + shipLastname : billFirstName + ' ' + billLastname}
                                            number={creditCard}
                                        />
                                    </div>

                                    <div>
                                        <Row gutter={ROW_GUTTER_CC}>
                                            <Col span={14}>
                                                <Form.Item name={['payment', 'number']} rules={[{ required: true }]}>
                                                    <Input
                                                        style={{ width: '100%' }}
                                                        type="number"
                                                        name="number"
                                                        onFocus={() => setFocused('number')}
                                                        placeholder={'Credit Card'}
                                                        onChange={(e) => {
                                                            setCreditCard((prev) => (prev = e.target.value));
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item name={['payment', 'cvc']} rules={[{ required: true, min: 0, max: 999 }]}>
                                                    <Input
                                                        style={{ width: '100%' }}
                                                        placeholder={'CVC'}
                                                        type="number"
                                                        name="cvc"
                                                        onFocus={() => setFocused('cvc')}
                                                        onChange={(e) => {
                                                            setCvc((prev) => (prev = e.target.value));
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={ROW_GUTTER_CC}>
                                            <Col span={12}>
                                                <Form.Item name={['payment', 'expiryMonth']} rules={[{ required: true }]}>
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        placeholder="Expiration Month"
                                                        allowClear
                                                        onFocus={() => setFocused('expiry')}
                                                        options={getMonths()}
                                                        onChange={changeMonth}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name={['payment', 'expiryYear']} rules={[{ required: true }]}>
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        placeholder="Expiration Year"
                                                        allowClear
                                                        onFocus={() => setFocused('expiry')}
                                                        options={getYears()}
                                                        onChange={changeYear}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={ROW_GUTTER_CC}>
                                            <Col span={24}>
                                                <Form.Item>
                                                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                                        Create Profile
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default CreateNewProfileModal;
