import { generateId, getCountriesOptions, getMonths, getRegionsOptions, getYears } from '@core/helpers';
import { ProfileGroupChannel } from '@core/IpcChannels';
import { ProfileFormData, profilePrefix, UserProfile } from '@core/Profile';
import { ProfileGroupViewData } from '@core/ProfileGroup';
import { Button, Checkbox, Divider, Form, Input, Modal, Select, Tabs } from 'antd';
import { FormInstance } from 'rc-field-form';
import React, { useState } from 'react';
import Cards from 'react-credit-cards';
const { TabPane } = Tabs;

type focus = 'number' | 'cvc' | 'expiry' | 'name' | undefined;

interface PaymentFormValues {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    cardHolderName: string;
}

interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    profileGroup: ProfileGroupViewData;
}

const AddProfileModal: React.FunctionComponent<Props> = (props) => {
    const [billingForm] = Form.useForm<UserProfile>();
    const [shippingForm] = Form.useForm<UserProfile>();
    const [paymentForm] = Form.useForm<PaymentFormValues>();

    const [profileName, setProfileName] = useState('New Profile Name');
    const [same, setSame] = useState(false);
    const [focused, setFocused] = useState<focus>(undefined);

    const { isOpen, setOpen, profileGroup } = props;

    const handleSameShippingBilling = (e) => {
        setSame(e.target.checked);
        if (e.target.checked) {
            const shippingValues = shippingForm.getFieldsValue();
            billingForm.setFieldsValue(shippingValues);
        } else {
            billingForm.resetFields();
        }
    };

    const onTabChange = (activeTab: 'shippingTab' | 'billingTab') => {
        if (activeTab === 'billingTab' && same) {
            const shippingValues = shippingForm.getFieldsValue();
            billingForm.setFieldsValue(shippingValues);
        }
    };

    const onCountryChange = (form: FormInstance) => {
        form.resetFields(['region']);
    };

    const onAddProfile = () => {
        const shippingProfile = shippingForm.getFieldsValue();
        const billingProfile = billingForm.getFieldsValue();
        const paymentProfile = paymentForm.getFieldsValue();

        const profileData: ProfileFormData = {
            id: generateId(profilePrefix),
            profileName: profileName,
            shipping: shippingProfile,
            billing: billingProfile,
            payment: paymentProfile,
        };

        window.ElectronBridge.send(ProfileGroupChannel.addProfileToGroup, profileGroup.id, [profileData]);
    };

    return (
        <div>
            <Modal
                centered
                title="Create a new profile"
                visible={isOpen}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
                footer={false}
            >
                <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                    <Tabs defaultActiveKey="shippingTab" onChange={onTabChange}>
                        <TabPane tab="Profile and Shipping" key="shippingTab">
                            <Form className="profile-form" form={shippingForm} name="shippingForm">
                                {/* https://github.com/ant-design/ant-design/issues/21829 */}
                                {() => (
                                    <>
                                        <Form.Item rules={[{ required: true }]}>
                                            <Input
                                                placeholder={'Profile name'}
                                                value={profileName}
                                                onChange={(e) => setProfileName(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                                            <Input placeholder={'Phone'} type="number" />
                                        </Form.Item>
                                        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                            <Input placeholder={'Email'} />
                                        </Form.Item>
                                        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                                            <Input placeholder={'Address'} />
                                        </Form.Item>
                                        <Form.Item name="town" label="Town" rules={[{ required: true }]}>
                                            <Input placeholder={'Town'} />
                                        </Form.Item>
                                        <Form.Item name="postalCode" label="Postal Code" rules={[{ required: true }]}>
                                            <Input placeholder={'Postal Code'} />
                                        </Form.Item>
                                        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                                            <Select
                                                placeholder="Country"
                                                options={getCountriesOptions()}
                                                allowClear
                                                onChange={() => onCountryChange(shippingForm)}
                                            ></Select>
                                        </Form.Item>
                                        <Form.Item name="region" label="Region" rules={[{ required: true }]}>
                                            <Select
                                                placeholder="Region"
                                                options={getRegionsOptions(shippingForm.getFieldsValue().country)}
                                                allowClear
                                            ></Select>
                                        </Form.Item>
                                    </>
                                )}
                            </Form>
                        </TabPane>

                        <TabPane tab="Payment Information" key="billingTab">
                            <Form form={billingForm} name="billingForm">
                                {/* https://github.com/ant-design/ant-design/issues/21829 */}
                                {() => (
                                    <>
                                        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                            <Input disabled={same} />
                                        </Form.Item>
                                        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                            <Input disabled={same} />
                                        </Form.Item>
                                        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                                            <Input placeholder={'Phone'} type="number" disabled={same} />
                                        </Form.Item>
                                        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                            <Input placeholder={'Email'} disabled={same} />
                                        </Form.Item>
                                        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                                            <Input placeholder={'Address'} disabled={same} />
                                        </Form.Item>
                                        <Form.Item name="town" label="Town" rules={[{ required: true }]}>
                                            <Input placeholder={'Town'} disabled={same} />
                                        </Form.Item>
                                        <Form.Item name="postalCode" label="Postal Code" rules={[{ required: true }]}>
                                            <Input placeholder={'Postal Code'} disabled={same} />
                                        </Form.Item>
                                        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                                            <Select
                                                placeholder="Country"
                                                options={getCountriesOptions()}
                                                allowClear
                                                onChange={() => onCountryChange(shippingForm)}
                                                disabled={same}
                                            ></Select>
                                        </Form.Item>
                                        <Form.Item name="region" label="Region" rules={[{ required: true }]}>
                                            <Select
                                                placeholder="Region"
                                                options={getRegionsOptions(billingForm.getFieldsValue().country)}
                                                allowClear
                                                disabled={same}
                                            ></Select>
                                        </Form.Item>

                                        <Checkbox checked={same} onChange={handleSameShippingBilling}>
                                            Same as shipping
                                        </Checkbox>
                                    </>
                                )}
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
                                    <Cards
                                        cvc={paymentForm.getFieldsValue().cvc ?? ''}
                                        expiry={`${paymentForm.getFieldsValue().expiryMonth ?? ''}/${paymentForm.getFieldsValue().expiryYear ?? ''}`}
                                        focused={focused}
                                        name={paymentForm.getFieldsValue().cardHolderName ?? ''}
                                        number={paymentForm.getFieldsValue().number ?? ''}
                                    />
                                </div>

                                <div>
                                    <Form form={paymentForm}>
                                        {() => (
                                            <>
                                                <Form.Item name={'cardHolderName'} label="Card Holder Name" rules={[{ required: true }]}>
                                                    <Input type="cardHolderName" />
                                                </Form.Item>
                                                <Form.Item name={'number'} label="Number" rules={[{ required: true }]}>
                                                    <Input type="number" />
                                                </Form.Item>
                                                <Form.Item name={'cvc'} label="CVC" rules={[{ required: true }]}>
                                                    <Input type="number" />
                                                </Form.Item>
                                                <Form.Item name={'expiryMonth'} rules={[{ required: true }]}>
                                                    <Select placeholder="Expiration Month" options={getMonths()} />
                                                </Form.Item>
                                                <Form.Item name={'expiryYear'} rules={[{ required: true }]}>
                                                    <Select placeholder="Expiration Year" allowClear options={getYears()} />
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form>
                                </div>
                                <div>
                                    <Button type="primary" htmlType="submit" onClick={onAddProfile} style={{ width: '100%' }}>
                                        Create Profile
                                    </Button>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        </div>
    );
};

export default AddProfileModal;
