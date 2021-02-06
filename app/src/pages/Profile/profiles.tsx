import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Form, Input, InputNumber, message, Popover, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import * as Constants from '../../constants';
import CreateNewProfileModal from './createNewProfile';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be 3 digits or less.',
    },
};

const monthOptions = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 10, label: 9 },
    { value: 11, label: 11 },
    { value: 12, label: 12 },
];

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

const UserFormData = {
    profile: '',
    same: false,
    shipping: {
        address: '88 address',
        city: '88 city',
        email: '88 email',
        firstname: '88 email',
        lastname: '88 email',
        phone: '88 email',
        postalcode: '88 email',
        province: '88 email',
    },

    billing: {
        address: '88 billing',
        city: '88 billing',
        email: '88 billing',
        firstname: '88 billing',
        lastname: '88 billing',
        phone: '88 billing',
        postalcode: '88 billing',
        province: '88 billing',
    },

    payment: {
        credit: 'dasd',
        cvc: 'dasd',
        month: 'asd',
        year: 'asdasd',
    },
};

const content = (UserFormData: any) => (
    <div>
        <Row>
            <Space>
                <Col>
                    <Divider> Shipping Address </Divider>
                    <p> {UserFormData.shipping.firstname} </p>
                    <p> {UserFormData.shipping.lastname} </p>
                    <p> {UserFormData.shipping.phone} </p>
                    <p> {UserFormData.shipping.email} </p>
                    <p> {UserFormData.shipping.address} </p>
                    <p> {UserFormData.shipping.city} </p>
                    <p> {UserFormData.shipping.postalcode} </p>
                    <p> {UserFormData.shipping.province} </p>
                </Col>
                <Col>
                    <Divider> Billing Address </Divider>
                    <p> {UserFormData.billing.firstname} </p>
                    <p> {UserFormData.billing.lastname} </p>
                    <p> {UserFormData.billing.phone} </p>
                    <p> {UserFormData.billing.email} </p>
                    <p> {UserFormData.billing.address} </p>
                    <p> {UserFormData.billing.city} </p>
                    <p> {UserFormData.billing.postalcode} </p>
                    <p> {UserFormData.billing.province} </p>
                </Col>
            </Space>
        </Row>
        <br />

        <Divider> Payment Info </Divider>
        <p> Credit Card: {UserFormData.payment.credit} </p>
        <p> CVC: {UserFormData.payment.cvc} </p>
        <p> Month: {UserFormData.payment.month} </p>
        <p> Year: {UserFormData.payment.year} </p>
    </div>
);

const ProfilePage = () => {
    const [yearOptions, setYearOptions] = useState([]);
    const [same, setSame] = useState(false);
    const [profiles, setUserProfiles] = useState([UserFormData, UserFormData, UserFormData, UserFormData, UserFormData, UserFormData]);

    useEffect(() => {
        setYearOptions(getYears());

        let db_profiles: any = localStorage.getItem('profiles');
        if (!db_profiles) {
            db_profiles = [];
            localStorage.setItem('profiles', '[]');
        } else {
            db_profiles = JSON.parse(db_profiles);
        }

        setUserProfiles(db_profiles);
    }, []);

    const onFinish = (values: any) => {
        for (let i = 0; i < profiles.length; i++) {
            if (profiles[i].profile === values.profile) {
                message.error(`Profile "${profiles[i].profile}" already exists!`);
                return null;
            }
        }

        if (values.same) {
            values['billing'] = values.shipping;
        }

        message.success('Profile created!');

        let prev_profiles = profiles;
        prev_profiles.push(values);

        setUserProfiles(prev_profiles);
        localStorage.setItem('profiles', JSON.stringify(prev_profiles));
    };

    const onDeleteProfile = (profileID: String): void => {
        if (profiles.length === 1 && profiles[0].profile === profileID) {
            localStorage.removeItem('profiles');
            setUserProfiles([]);
            localStorage.setItem('profiles', JSON.stringify([]));

            return;
        }

        for (let i = 0; i < profiles.length; i++) {
            if (profiles[i].profile === profileID) {
                let old_profiles = profiles;
                old_profiles.splice(i, 1);

                // localStorage.removeItem('profiles');
                localStorage.setItem('profiles', JSON.stringify(old_profiles));
                setUserProfiles(old_profiles);

                return;
            }
        }
    };

    const ShowProfiles = (all_profils: any[]) => {
        if (!all_profils.length) return <h1> No Profile Found. </h1>;

        return all_profils.map((value) => {
            return (
                <Popover content={content(value)} placement="right">
                    <Card
                        size="small"
                        title={value.profile}
                        extra={<Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDeleteProfile(value.profile)} />}
                        style={{ width: 200, height: 140, margin: 3 }}
                    >
                        <p> {`${value.shipping.firstname} ${value.shipping.lastname}`} </p>
                        <p> {`${value.shipping.address}`} </p>
                    </Card>
                </Popover>
            );
        });
    };

    return (
        <div style={{ padding: 24, backgroundColor: '#212427', height: '100vh' }}>
            <div style={{ float: 'right' }}>
                <CreateNewProfileModal onFinish={onFinish} />
            </div>

            <Divider> My Profiles </Divider>

            {ShowProfiles(profiles)}
        </div>
    );
};

export default ProfilePage;
