import { IProfile } from '@core/Profile';
import { Button, Checkbox, Col, Divider, Form, Input, Modal, Row, Select, Tabs } from 'antd';
import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import { COUNTRY, REGIONS } from '../../common/Regions';
const { Option } = Select;
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
    const years = [];
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

interface Props {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProfileModal: React.FunctionComponent<Props> = (props) => {
    const [shippingForm] = Form.useForm();
    const [billingForm] = Form.useForm();

    const [same, setSame] = useState(false);
    const [focused, setFocused] = useState<focus>(undefined);

    const { showModal, setShowModal } = props;

    const [shipFirstName, setshipFirstName] = useState('');
    const [shipLastname, setshipLastName] = useState('');

    const [billFirstName, setFirstName] = useState('');
    const [billLastname, setLastName] = useState('');

    const [creditCard, setCreditCard] = useState('');
    const [cvc, setCvc] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const [country, setCountry] = useState('default');

    const checkIfBillingSame = (isSame: boolean) => {
        if (isSame) {
            const shippingValues = shippingForm.getFieldsValue();
            billingForm.setFieldsValue(shippingValues);
        } else {
            billingForm.resetFields();
        }
    };
    const handleSameShippingBilling = (e) => {
        setSame(e.target.checked);
        checkIfBillingSame(e.target.checked);
    };

    const onTabChange = (activeTab: 'shippingTab' | 'billingTab') => {
        checkIfBillingSame(activeTab === 'billingTab' && same);
    };

    const changeMonth = (value: any) => {
        setMonth((prev) => (prev = value));
    };

    const changeYear = (value: any) => {
        setYear((prev) => (prev = value));
    };

    const onCountryChange = (iso: string) => {
        setCountry(iso);
        shippingForm.resetFields(['region']);
        billingForm.resetFields(['region']);
    };

    const onAddProfile = () => {
        console.log('adding profile');
        const shippingProfile = shippingForm.getFieldsValue();
        const billingProfile = billingForm.getFieldsValue();
        const profile: IProfile = {
            profileName: shippingProfile['profileName'],
            profileData: {
                shipping: {},
                billing: {},
                payment: {},
            },
        };

        // window.ElectronBridge.send(ProfileChannel.addProfile, {});
        setShowModal(false);
    };
    return (
        <div>
            <Modal
                centered
                title="Create a new profile"
                visible={showModal}
                onOk={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
                width={1000}
                footer={false}
            >
                <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                    <Tabs defaultActiveKey="shippingTab" onChange={onTabChange}>
                        <TabPane tab="Profile and Shipping" key="shippingTab">
                            <Form form={shippingForm} validateMessages={validateMessages}>
                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name="profileName" rules={[{ required: true }]}>
                                            <Input placeholder={'Profile name'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={'firstName'} rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'First name'}
                                                onChange={(e) => {
                                                    setshipFirstName((prev) => (prev = e.target.value));
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'lastName'} rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'Last name'}
                                                onChange={(e) => {
                                                    setshipLastName((prev) => (prev = e.target.value));
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'phone'} rules={[{ required: true }]}>
                                            <Input placeholder={'Phone'} type="number" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={'email'} rules={[{ required: true }]}>
                                            <Input placeholder={'Email'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'address'} rules={[{ required: true }]}>
                                            <Input placeholder={'Address'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'country'} rules={[{ required: true }]}>
                                            <Select placeholder="Country" onChange={onCountryChange} allowClear>
                                                {Object.keys(COUNTRY).map((name) => (
                                                    <Option key={name} value={name}>
                                                        {name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={'region'} rules={[{ required: true }]}>
                                            <Select placeholder="Province/State" allowClear>
                                                {Object.entries(ALL_REGIONS[country]).map(([name, value]: [string, any]) => (
                                                    <Option key={name} value={name}>
                                                        {name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={'town'} rules={[{ required: true }]}>
                                            <Input placeholder={'City'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'postalCode'} rules={[{ required: true }]}>
                                            <Input placeholder={'Postal Code/Zip Code'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </TabPane>

                        <TabPane tab="Payment Information" key="billingTab">
                            <Form form={billingForm} validateMessages={validateMessages}>
                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={'firstName'} rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'First name'}
                                                onChange={(e) => {
                                                    setFirstName((prev) => (prev = e.target.value));
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'lastName'} rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'Last name'}
                                                onChange={(e) => {
                                                    setLastName(e.target.value);
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'phone'} rules={[{ required: true }]}>
                                            <Input placeholder={'Phone'} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={'email'} rules={[{ required: true, type: 'email' }]}>
                                            <Input placeholder={'email'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'address'} rules={[{ required: true }]}>
                                            <Input placeholder={'Address'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name={'country'} rules={[{ required: true }]}>
                                            <Select placeholder="Country" onChange={onCountryChange} allowClear>
                                                {Object.keys(COUNTRY).map((name) => (
                                                    <Option key={name} value={name}>
                                                        {name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name={'region'} rules={[{ required: true }]}>
                                            <Select placeholder="Province/State" allowClear>
                                                {Object.entries(ALL_REGIONS[country]).map(([name, value]: [string, any]) => (
                                                    <Option key={name} value={name}>
                                                        {name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={'town'} rules={[{ required: true }]}>
                                            <Input placeholder={'City'} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={'postalCode'} rules={[{ required: true }]}>
                                            <Input placeholder={'Postal Code/Zip Code'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Checkbox checked={same} onChange={handleSameShippingBilling}>
                                            Same as shipping
                                        </Checkbox>
                                    </Col>
                                </Row>
                                <Divider> Enter your card </Divider>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        overflow: 'auto',
                                        padding: 15,
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
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
                                                            setCreditCard(e.target.value);
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
                                                            setCvc(e.target.value);
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
                                                <Button type="primary" htmlType="submit" style={{ width: '100%' }} onClick={onAddProfile}>
                                                    Create Profile
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Form>
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        </div>
    );
};

export default AddProfileModal;
