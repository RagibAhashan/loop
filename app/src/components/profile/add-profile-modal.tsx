import { CreditCardFormData } from '@core/credit-card';
import { generateId, getCountriesOptions, getMonths, getRegionsOptions, getYears } from '@core/helpers';
import { ProfileGroupChannel } from '@core/ipc-channels';
import { ProfileFormData, profilePrefix, UserProfile } from '@core/profile';
import { ProfileGroupViewData } from '@core/profilegroup';
import { Button, Checkbox, Divider, Form, Input, message, Modal, Select, Tabs } from 'antd';
import React, { useState } from 'react';
import Cards from 'react-credit-cards';
const { TabPane } = Tabs;

type focus = 'number' | 'cvc' | 'expiry' | 'name' | undefined;

const requiredWithoutMessage = { required: true, message: '' };
interface UserProfileFormValues {
    profileName: string;
    shipping: UserProfile;
    billing: UserProfile;
    payment: CreditCardFormData;
}

interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    profileGroup: ProfileGroupViewData;
}

const AddProfileModal: React.FunctionComponent<Props> = (props) => {
    const [profileForm] = Form.useForm<UserProfileFormValues>();

    const [same, setSame] = useState(false);
    const [focused, setFocused] = useState<focus>(undefined);

    const { isOpen, setOpen, profileGroup } = props;

    const handleSameShippingBilling = (e) => {
        setSame(e.target.checked);
        const allValues = profileForm.getFieldsValue();
        if (e.target.checked) {
            const shippingValues = profileForm.getFieldsValue().shipping;
            profileForm.setFieldsValue({ ...allValues, billing: { ...shippingValues } });
        } else {
            profileForm.resetFields(['billing']);
        }
    };

    const onTabChange = (activeTab: 'shippingTab' | 'billingTab') => {
        if (activeTab === 'billingTab' && same) {
            const allValues = profileForm.getFieldsValue();
            const shippingValues = profileForm.getFieldsValue().shipping;
            profileForm.setFieldsValue({ ...allValues, billing: { ...shippingValues } });
        }
    };

    const onCountryChange = (form: string) => {
        const values = profileForm.getFieldsValue()[form];
        // Reset region
        profileForm.setFieldsValue({ [form]: { ...values, region: undefined } });
    };

    const onAddProfile = () => {
        const allValues = profileForm.getFieldsValue();

        const profileData: ProfileFormData = {
            id: generateId(profilePrefix),
            profileName: allValues.profileName,
            shipping: allValues.shipping,
            billing: allValues.billing,
            payment: allValues.payment,
        };

        window.ElectronBridge.send(ProfileGroupChannel.addProfileToGroup, profileGroup.id, [profileData]);
    };

    const handleFormSubmit = () => {
        console.log('submitted all forms');
    };

    const handleFormFailed = (errors: any) => {
        console.log('form failed', errors);
        message.error('Please fill all the form!');
    };

    const cvc = profileForm.getFieldsValue().payment?.cvc || '';
    const expiry = `${profileForm.getFieldsValue().payment?.expiryMonth || ''}/${profileForm.getFieldsValue().payment?.expiryYear || ''}`;
    const name = profileForm.getFieldsValue().payment?.cardHolderName || '';
    const number = profileForm.getFieldsValue().payment?.number || '';

    return (
        <div>
            <Form
                className="profile-form"
                form={profileForm}
                layout="vertical"
                requiredMark={false}
                onFinish={handleFormSubmit}
                onFinishFailed={handleFormFailed}
                id="profileForm"
            >
                {/* https://github.com/ant-design/ant-design/issues/21829 */}

                {() => (
                    <>
                        <Modal
                            centered
                            title="Create a new profile"
                            visible={isOpen}
                            onOk={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                            width={1000}
                            footer={
                                <Button type="primary" form="profileForm" htmlType="submit" style={{ width: '100%' }}>
                                    Create Profile
                                </Button>
                            }
                        >
                            <div>
                                <Tabs defaultActiveKey="shippingTab" onChange={onTabChange}>
                                    <TabPane tab="Profile and Shipping" key="shippingTab">
                                        <Form.Item name={['profileName']} label="Profile Name" required rules={[requiredWithoutMessage]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name={['shipping', 'firstName']} label="First Name" required rules={[requiredWithoutMessage]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name={['shipping', 'lastName']} label="Last Name" required rules={[requiredWithoutMessage]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name={['shipping', 'phone']} label="Phone" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Phone'} type="number" />
                                        </Form.Item>
                                        <Form.Item name={['shipping', 'email']} label="Email" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Email'} />
                                        </Form.Item>
                                        <Form.Item name={['shipping', 'address']} label="Address" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Address'} />
                                        </Form.Item>
                                        <Form.Item name={['shipping', 'town']} label="Town" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Town'} />
                                        </Form.Item>
                                        <Form.Item name={['shipping', 'postalCode']} label="Postal Code" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Postal Code'} />
                                        </Form.Item>
                                        <Form.Item name={['shipping', 'country']} label="Country" required rules={[requiredWithoutMessage]}>
                                            <Select
                                                placeholder="Country"
                                                options={getCountriesOptions()}
                                                allowClear
                                                onChange={() => onCountryChange('shipping')}
                                            ></Select>
                                        </Form.Item>
                                        <Form.Item
                                            name={['shipping', 'region']}
                                            label="Region"
                                            required
                                            rules={[requiredWithoutMessage]}
                                            dependencies={['shipping']}
                                        >
                                            <Select
                                                placeholder="Region"
                                                options={getRegionsOptions(profileForm.getFieldsValue().shipping?.country)}
                                                allowClear
                                            ></Select>
                                        </Form.Item>
                                    </TabPane>

                                    <TabPane tab="Payment Information" key="billingTab">
                                        <Form.Item name={['billing', 'firstName']} label="First Name" required rules={[requiredWithoutMessage]}>
                                            <Input disabled={same} />
                                        </Form.Item>
                                        <Form.Item name={['billing', 'lastName']} label="Last Name" required rules={[requiredWithoutMessage]}>
                                            <Input disabled={same} />
                                        </Form.Item>
                                        <Form.Item name={['billing', 'phone']} label="Phone" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Phone'} type="number" disabled={same} />
                                        </Form.Item>
                                        <Form.Item name={['billing', 'email']} label="Email" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Email'} disabled={same} />
                                        </Form.Item>
                                        <Form.Item name={['billing', 'address']} label="Address" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Address'} disabled={same} />
                                        </Form.Item>
                                        <Form.Item name={['billing', 'town']} label="Town" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Town'} disabled={same} />
                                        </Form.Item>
                                        <Form.Item name={['billing', 'postalCode']} label="Postal Code" required rules={[requiredWithoutMessage]}>
                                            <Input placeholder={'Postal Code'} disabled={same} />
                                        </Form.Item>
                                        <Form.Item name={['billing', 'country']} label="Country" required rules={[requiredWithoutMessage]}>
                                            <Select
                                                placeholder="Country"
                                                options={getCountriesOptions()}
                                                allowClear
                                                onChange={() => onCountryChange('billing')}
                                                disabled={same}
                                            ></Select>
                                        </Form.Item>
                                        <Form.Item name={['billing', 'region']} label="Region" required rules={[requiredWithoutMessage]}>
                                            <Select
                                                placeholder="Region"
                                                options={getRegionsOptions(profileForm.getFieldsValue().billing?.country)}
                                                allowClear
                                                disabled={same}
                                            ></Select>
                                        </Form.Item>

                                        <Checkbox checked={same} onChange={handleSameShippingBilling}>
                                            Same as shipping
                                        </Checkbox>

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
                                                <Cards cvc={cvc} expiry={expiry} focused={focused} name={name} number={number} />
                                            </div>

                                            <div>
                                                <Form.Item
                                                    name={['payment', 'cardHolderName']}
                                                    label="Card Holder Name"
                                                    required
                                                    rules={[requiredWithoutMessage]}
                                                >
                                                    <Input type="cardHolderName" />
                                                </Form.Item>
                                                <Form.Item name={['payment', 'number']} label="Number" required rules={[requiredWithoutMessage]}>
                                                    <Input type="number" />
                                                </Form.Item>
                                                <Form.Item name={['payment', 'cvc']} label="CVC" required rules={[requiredWithoutMessage]}>
                                                    <Input type="number" />
                                                </Form.Item>
                                                <Form.Item name={['payment', 'expiryMonth']} required rules={[requiredWithoutMessage]}>
                                                    <Select placeholder="Expiration Month" options={getMonths()} />
                                                </Form.Item>
                                                <Form.Item name={['payment', 'expiryYear']} required rules={[requiredWithoutMessage]}>
                                                    <Select placeholder="Expiration Year" allowClear options={getYears()} />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Modal>
                    </>
                )}
            </Form>
        </div>
    );
};

export default AddProfileModal;
