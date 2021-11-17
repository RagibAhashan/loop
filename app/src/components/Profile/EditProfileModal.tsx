import { COUNTRY, REGIONS } from '@common/Regions';
import { ProfileChannel } from '@core/IpcChannels';
import { Profile } from '@core/Profile';
import { Button, Checkbox, Col, Divider, Form, Input, Modal, Row, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const { TabPane } = Tabs;

const { Option } = Select;
type IObj = {
    [key: string]: any;
};

const ALL_REGIONS: IObj = REGIONS;

const ROW_GUTTER: [number, number] = [8, 0];
const ROW_GUTTER_CC: [number, number] = [8, 0];

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: 'required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be 3 digits or less.',
    },
};

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};

const getYears = (): any => {
    const year = new Date().getFullYear();
    const years = [];
    for (let i = year; i < year + 15; i++) {
        years.push({
            value: i,
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
    profileName: string;
}

const EditProfileModal: React.FunctionComponent<Props> = (props) => {
    const { showModal, setShowModal, profileName } = props;

    const [currentProfile, setCurrentProfile] = useState<Profile>();

    const [shippingForm] = Form.useForm();
    const [billingForm] = Form.useForm();
    const [paymentForm] = Form.useForm();

    const [country, setCountry] = useState('default');

    const [same, setSame] = useState(false);
    const [front, setFront] = useState(true);

    const [shipFirstName, setshipFirstName] = useState('');
    const [shipLastname, setshipLastName] = useState('');

    const [billFirstName, setFirstName] = useState('');
    const [billLastname, setLastName] = useState('');

    const [creditCard, setCreditCard] = useState('');
    const [cvc, setCvc] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('init edit profile modal');
        window.ElectronBridge.invoke(ProfileChannel.getProfile, profileName).then((profile: Profile) => {
            console.log('invoke profile response', profile);
            setCurrentProfile(profile);
            shippingForm.setFieldsValue(profile.profileData.shipping);
            billingForm.setFieldsValue(profile.profileData.billing);
            paymentForm.setFieldsValue(profile.profileData.payment);
        });
    }, [billingForm, paymentForm, profileName, shippingForm]);

    const changeMonth = (value: any) => {
        setMonth((prev) => (prev = value));
        setFront(true);
    };

    const changeYear = (value: any) => {
        setYear((prev) => (prev = value));
        setFront(true);
    };

    const editProfile = (value: any) => {
        console.log('edit !', value);
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
                    <Tabs defaultActiveKey="shippingTab">
                        <TabPane tab="Profile and Shipping" key="shippingTab">
                            <Form form={shippingForm} validateMessages={validateMessages}>
                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item rules={[{ required: true }]}>
                                            <Input defaultValue={profileName} placeholder={'Profile name'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name="firstName" rules={[{ required: true }]}>
                                            <Input placeholder={'First name'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="lastName" rules={[{ required: true }]}>
                                            <Input placeholder={'Last name'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="phone" rules={[{ required: true }]}>
                                            <Input placeholder={'Phone'} type="number" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name="email" rules={[{ required: true }]}>
                                            <Input placeholder={'Email'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="address" rules={[{ required: true }]}>
                                            <Input placeholder={'Address'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="country" rules={[{ required: true }]}>
                                            <Select placeholder="Country" allowClear>
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
                                        <Form.Item name="region" rules={[{ required: true }]}>
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
                                        <Form.Item name="town" rules={[{ required: true }]}>
                                            <Input placeholder={'City'} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="postalCode" rules={[{ required: true }]}>
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
                                        <Form.Item name="firstName" rules={[{ required: true }]}>
                                            <Input placeholder={'First name'} disabled={same} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="lastName" rules={[{ required: true }]}>
                                            <Input placeholder={'Last name'} disabled={same} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="phone" rules={[{ required: true }]}>
                                            <Input placeholder={'Phone'} disabled={same} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={ROW_GUTTER}>
                                    <Col span={8}>
                                        <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                                            <Input placeholder={'email'} disabled={same} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="address" rules={[{ required: true }]}>
                                            <Input placeholder={'Address'} disabled={same} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item name="country" rules={[{ required: true }]}>
                                            <Select placeholder="Country" allowClear disabled={same}>
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
                                        <Form.Item name="region" rules={[{ required: true }]}>
                                            <Select placeholder="Province/State" allowClear disabled={same}>
                                                {Object.entries(ALL_REGIONS[country]).map(([name, value]: [string, any]) => (
                                                    <Option key={name} value={name}>
                                                        {name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="town" rules={[{ required: true }]}>
                                            <Input placeholder={'City'} disabled={same} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="postalCode" rules={[{ required: true }]}>
                                            <Input placeholder={'Postal Code/Zip Code'} disabled={same} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Checkbox checked={same}>Same as shipping</Checkbox>
                                    </Col>
                                </Row>
                            </Form>

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
                                    {/* <Cards
                                        cvc={cvc}
                                        expiry={`${month}${year}`}
                                        focused={focused}
                                        name={same ? `${shipFirstName} ${shipLastName}` : `${billFirstName} ${billLastName}`}
                                        number={creditCardNumber}
                                    /> */}
                                </div>

                                <div>
                                    <Form form={paymentForm} validateMessages={validateMessages}>
                                        <Row gutter={ROW_GUTTER_CC}>
                                            <Col span={14}>
                                                <Form.Item name={'number'} rules={[{ required: true }]}>
                                                    <Input style={{ width: '100%' }} type="number" name="number" placeholder={'Credit Card'} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item name={'cvc'} rules={[{ required: true, min: 0, max: 999 }]}>
                                                    <Input
                                                        style={{ width: '100%' }}
                                                        placeholder={'CVC'}
                                                        type="number"
                                                        name="cvc"
                                                        onChange={(e) => {
                                                            setCvc(e.target.value);
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={ROW_GUTTER_CC}>
                                            <Col span={12}>
                                                <Form.Item name={'expiryMonth'} rules={[{ required: true }]}>
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        placeholder="Expiration Month"
                                                        allowClear
                                                        options={getMonths()}
                                                        onChange={changeMonth}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name={'expiryYear'} rules={[{ required: true }]}>
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        placeholder="Expiration Year"
                                                        allowClear
                                                        options={getYears()}
                                                        onChange={changeYear}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                    <Row gutter={ROW_GUTTER_CC}>
                                        <Col span={24}>
                                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                                Edit Profile
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        </div>
    );
};

export default EditProfileModal;
