import { Button, Checkbox, Col, Divider, Form, Input, Modal, Row, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import Cards from 'react-credit-cards';
import { useDispatch } from 'react-redux';
import { UserProfile } from '../../interfaces/TaskInterfaces';
import { deleteProfile } from '../../services/Profile/ProfileService';

const { TabPane } = Tabs;

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
    let years = [];
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

const EditProfileModal = (props: any) => {
    const {
        isEditModalVisible,
        setIsEditModalVisible,
        profile,
    }: { isEditModalVisible: boolean; setIsEditModalVisible: any; profile: UserProfile; onDeleteProfile: any } = props;
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
        setFirstName(profile.billing.firstName);
        setLastName(profile.billing.lastName);
        setCreditCard(profile.payment.number);
        setCvc(profile.payment.cvc);
        setMonth(profile.payment.expiryMonth.length === 1 ? `0${profile.payment.expiryMonth}12` : profile.payment.expiryMonth);
        setYear(profile.payment.expiryYear);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOk = () => {
        setIsEditModalVisible(false);
    };

    const handleCancel = () => {
        // onDeleteProfile(data.profile)
        setIsEditModalVisible(false);
    };

    const onDeleteProfile = (profileName: string) => {
        dispatch(deleteProfile(profileName));
    };

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
                title="View Profile"
                visible={isEditModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                okText="Save"
                cancelText="Delete profile"
                footer={false}
            >
                <Form name="nest-messages" onFinish={editProfile} validateMessages={validateMessages}>
                    <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                        <Tabs
                            defaultActiveKey="1"
                            tabBarExtraContent={
                                <div>
                                    <Button
                                        type="primary"
                                        danger
                                        style={{ marginLeft: '-10px' }}
                                        onClick={() => {
                                            onDeleteProfile(profile.name);
                                            setIsEditModalVisible(false);
                                        }}
                                    >
                                        Delete Profile
                                    </Button>
                                </div>
                            }
                        >
                            <TabPane tab="Profile and Shipping" key="1">
                                <Row>
                                    <Form.Item name="profile" rules={[{ required: true }]}>
                                        <Input
                                            disabled={true}
                                            placeholder={'Profile name'}
                                            style={{ width: '400px', margin: '1%', height: '40px' }}
                                            defaultValue={profile.name}
                                        />
                                    </Form.Item>
                                </Row>
                                <br />
                                <Row>
                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={['shipping', 'firstName']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'First name'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.shipping.firstName}
                                                onChange={(e) => {
                                                    setshipFirstName((prev) => (prev = e.target.value));
                                                    if (!front) {
                                                        setFront((prev) => (prev = true));
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={['shipping', 'lastName']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Last name'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.shipping.lastName}
                                                onChange={(e) => {
                                                    setshipLastName((prev) => (prev = e.target.value));
                                                    if (!front) {
                                                        setFront((prev) => (prev = true));
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={['shipping', 'phone']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Phone'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.shipping.phone}
                                                type="number"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={['shipping', 'email']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Email'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.shipping.email}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={['shipping', 'address']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Address'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.shipping.address}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={['shipping', 'town']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'City'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.shipping.town}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={['shipping', 'postalCode']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Postal Code'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.shipping.postalCode}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={['shipping', 'region']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Province'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.shipping.region}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </TabPane>

                            <TabPane tab="Payment Information" key="2">
                                <Row>
                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'firstName']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'First name'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.billing.firstName}
                                                onChange={(e) => {
                                                    setFirstName((prev) => (prev = e.target.value));
                                                    if (!front) {
                                                        setFront((prev) => (prev = true));
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'lastName']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Last name'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.billing.lastName}
                                                onChange={(e) => {
                                                    setLastName((prev) => (prev = e.target.value));
                                                    if (!front) {
                                                        setFront((prev) => (prev = true));
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'phone']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Phone'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.billing.phone}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'email']} rules={[{ required: true, type: 'email' }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'email'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.billing.email}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'address']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Address'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.billing.address}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'region']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'City'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.billing.region}
                                                value={profile.billing.region}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'postalCode']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Postal Code/Zip Code'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.billing.postalCode}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item name={[same ? 'shipping' : 'billing', 'region']} rules={[{ required: true }]}>
                                            <Input
                                                disabled={true}
                                                placeholder={'Province/State'}
                                                style={{ height: '40px' }}
                                                defaultValue={profile.billing.region}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col style={{ width: '30%', margin: '1%' }}>
                                        <Form.Item wrapperCol={{ ...layout.wrapperCol }} name="same" valuePropName="checked">
                                            <Checkbox
                                                disabled={true}
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
                                <br />
                                <Divider> Enter your card </Divider>
                                <Row>
                                    <Col span={12}>
                                        <Cards
                                            cvc={cvc}
                                            expiry={`${month}${year}`}
                                            focused={front ? 'number' : 'cvc'}
                                            name={same ? shipFirstName + ' ' + shipLastname : billFirstName + ' ' + billLastname}
                                            number={creditCard}
                                        />
                                    </Col>

                                    <Col span={12}>
                                        <br />
                                        <Row>
                                            <Col span={14}>
                                                <Form.Item name={['payment', 'credit']} rules={[{ required: true }]}>
                                                    <Input
                                                        disabled={true}
                                                        style={{ width: '100%', height: '40px' }}
                                                        placeholder={'Credit Card'}
                                                        defaultValue={profile.payment.number}
                                                        type="number"
                                                        onChange={(e) => {
                                                            setCreditCard((prev) => (prev = e.target.value));
                                                            if (!front) {
                                                                setFront((prev) => (prev = true));
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6} style={{ marginLeft: '1%' }}>
                                                <Form.Item name={['payment', 'cvc']} rules={[{ required: true, min: 0, max: 999 }]}>
                                                    <Input
                                                        disabled={true}
                                                        style={{ width: '100%', height: '40px' }}
                                                        placeholder={'CVC'}
                                                        defaultValue={profile.payment.cvc}
                                                        type="number"
                                                        onChange={(e) => {
                                                            setCvc((prev) => (prev = e.target.value));
                                                            if (front) {
                                                                setFront((prev) => (prev = false));
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <br />
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item name={['payment', 'month']} rules={[{ required: true }]}>
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        placeholder="Expiration Year"
                                                        allowClear
                                                        options={getMonths()}
                                                        defaultValue={profile.payment.expiryMonth}
                                                        onChange={changeMonth}
                                                        disabled={true}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10} style={{ marginLeft: '1%' }}>
                                                <Form.Item name={['payment', 'year']} rules={[{ required: true }]}>
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        placeholder="Expiration Year"
                                                        allowClear
                                                        options={getYears()}
                                                        defaultValue={profile.payment.expiryYear}
                                                        onChange={changeYear}
                                                        disabled={true}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default EditProfileModal;
