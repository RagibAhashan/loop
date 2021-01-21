import React, { useState, useEffect } from 'react';
import { Row, Col, Divider, Input, Form, Select, InputNumber, Button, Checkbox, message, Card, Space, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import * as Constants from '../constants';
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

const getYears = () => {
    const year = new Date().getFullYear();
    let years = []
    for(let i=year; i < year+15; i++) {
        years.push({
            value: i,
            label: i
        })
    }
    return years;
}

const UserFormData = {
    profile: "",
    same: false,
    shipping: {
        address: "88 address",
        city: "88 city",
        email: "88 email",
        firstname: "88 email",
        lastname: "88 email",
        phone: "88 email",
        postalcode: "88 email",
        province: "88 email",
    },

    billing: {
        address: "88 billing",
        city: "88 billing",
        email: "88 billing",
        firstname: "88 billing",
        lastname: "88 billing",
        phone: "88 billing",
        postalcode: "88 billing",
        province: "88 billing",
    },

    payment: {
        credit: "dasd",
        cvc: "dasd",
        month: "asd",
        year: "asdasd",
    }
}

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

const BillingPage = (props: any) => {
    const { setPage } = props;
    const [yearOptions, setYearOptions] = useState([]);
    const [same, setSame] = useState(false);
    const [profiles, setUserProfiles] = useState([
        UserFormData, UserFormData, UserFormData, UserFormData, UserFormData, UserFormData
    ]);

    useEffect(() => {
        setYearOptions(getYears())

        let db_profiles: any = localStorage.getItem('profiles');
        if (!db_profiles) {
            db_profiles = []
            localStorage.setItem('profiles', '[]');
        } else {
            db_profiles = JSON.parse(db_profiles);
        }

        setUserProfiles(db_profiles)
    }, []);

    const onFinish = (values: any) => {
        for (let i=0; i < profiles.length; i++) {
            if (profiles[i].profile === values.profile) {
                message.error(`Profile "${profiles[i].profile}" already exists!`)
                return null;
            }
        }

        if (values.same) {
            values['billing'] = values.shipping;
        }

        message.success('Profile created!');

        let prev_profiles = profiles;
        prev_profiles.push(values)

        setUserProfiles(prev_profiles)
        localStorage.setItem('profiles', JSON.stringify(prev_profiles));
        setPage(Constants.PROXIES)
        setPage(Constants.BILLING)
    };

    const onDeleteProfile = (profileID: String): void =>{
        if (profiles.length === 1 && profiles[0].profile === profileID) {
            localStorage.removeItem('profiles');
            setUserProfiles([]);
            localStorage.setItem('profiles', JSON.stringify([]));
            setPage(Constants.PROXIES)
            setPage(Constants.BILLING)
            return ;
        }

        for (let i=0; i < profiles.length; i++) {
            if (profiles[i].profile === profileID) {
                let old_profiles = profiles;
                old_profiles.splice(i,1);

                // localStorage.removeItem('profiles');
                localStorage.setItem('profiles', JSON.stringify(old_profiles));
                setUserProfiles(old_profiles);
                setPage(Constants.PROXIES)
                setTimeout(() => {
                    setPage(Constants.BILLING)
                }, 0.5)


                return ;
            }
        }

    }


    const ShowProfiles = (all_profils: any[]) => {

        if (!all_profils.length) return (<h1> No Profile Found. </h1>)

        return all_profils.map( (value) => {
          return (
                <Popover content={content(value)} placement="right">
                    <Card size="small"
                        title={value.profile}
                        extra={
                            <Button type="link" danger icon={<DeleteOutlined />}
                                onClick={() => onDeleteProfile(value.profile)}
                            />
                        }
                        style={{ width: 200, height: 140, margin: 3 }}
                    >
                        <p> {`${value.shipping.firstname} ${value.shipping.lastname}`} </p>
                        <p> {`${value.shipping.address}`} </p>

                    </Card>
                </Popover>
          )
        })

    }





    return (
        <div style={{padding: 24}}>

            {/* {profiles.length === 0 ? <div /> : */}
                <Row>
                <Divider> My Profiles </Divider>

                    {ShowProfiles(profiles)}
                 </Row>


            <Row>

            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} style={{marginTop:'30px'}}>
                <Row>
                    <Divider> Add Profile </Divider>
                    <Col span={12}>
                        <Form.Item name="profile" label="Profile Name" rules={[{ required: true }]}>
                            <Input placeholder=""/>
                        </Form.Item>
                    </Col>
                </Row>


                <Row>
                    <Col span={12}>
                    <Divider> Shipping Address </Divider>


                            <Form.Item name={['shipping', 'firstname']} label="First Name" rules={[{ required: true }]}>
                                <Input placeholder=""/>
                            </Form.Item>

                            <Form.Item name={['shipping', 'lastname']} label="Last Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name={['shipping', 'phone']} label="Phone" rules={[{ required: true }]}>
                                <Input
                                    placeholder="ex:5142223333"
                                    type="number"
                                />
                            </Form.Item>
                            <br />
                            <Form.Item name={['shipping', 'email']} label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input placeholder="ex: youremail@gmail.com"/>
                            </Form.Item>

                            <Form.Item name={['shipping', 'address']} label="Address" rules={[{ required: true  }]}>
                                <Input placeholder="ex: 9900 avenue Yourstreet"/>
                            </Form.Item>

                            <Form.Item name={['shipping', 'city']} label="City" rules={[{ required: true  }]}>
                                <Input placeholder="ex: Montreal"/>
                            </Form.Item>

                            <Form.Item name={['shipping', 'postalcode']} label="Postal Code" rules={[{ required: true  }]}>
                                <Input placeholder="ex: H8Q 1X0"/>
                            </Form.Item>

                            <Form.Item name={['shipping', 'province']} label="Province" rules={[{ required: true  }]}>
                                <Input placeholder="ex: Quebec"/>
                            </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Divider> Billing Address </Divider>


                            <Form.Item name={[same ? 'shipping' : 'billing', 'firstname']} label="First Name" rules={[{ required: true }]}>
                                <Input placeholder=""/>
                            </Form.Item>

                            <Form.Item name={[same ? 'shipping' : 'billing', 'lastname']} label="Last Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name={[same ? 'shipping' : 'billing', 'phone']} label="Phone" rules={[{ required: true,  }]}>
                                <Input
                                    placeholder="ex:5142223333"
                                    type="number"
                                />
                            </Form.Item>
                            <br />
                            <Form.Item name={[same ? 'shipping' : 'billing', 'email']} label="email" rules={[{ required: true, type: 'email' }]}>
                                <Input placeholder="ex: youremail@gmail.com"/>
                            </Form.Item>

                            <Form.Item name={[same ? 'shipping' : 'billing', 'address']} label="Address" rules={[{ required: true  }]}>
                                <Input placeholder="ex: 9900 avenue Yourstreet"/>
                            </Form.Item>

                            <Form.Item name={[same ? 'shipping' : 'billing', 'city']} label="City" rules={[{ required: true  }]}>
                                <Input placeholder="ex: Montreal"/>
                            </Form.Item>

                            <Form.Item name={[same ? 'shipping' : 'billing', 'postalcode']} label="Postal Code" rules={[{ required: true  }]}>
                                <Input placeholder="ex: H8Q 1X0"/>
                            </Form.Item>

                            <Form.Item name={[same ? 'shipping' : 'billing', 'province']} label="Province" rules={[{ required: true  }]}>
                                <Input placeholder="ex: Quebec"/>
                            </Form.Item>

                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }} name="same" valuePropName="checked">
                                <Checkbox checked={same}
                                    onChange={(e) => {
                                        setSame(e.target.checked)
                                    }}
                                > Same as shipping address </Checkbox>
                            </Form.Item>

                    </Col>

                    <Divider> Credit Card Information </Divider>
                    <Col span={10}>
                        <Form.Item name={['payment', 'credit']} label="Credit Card" rules={[{ required: true }]}>
                            <Input.Password placeholder="ex: 1111222233334444"/>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item name={['payment', 'cvc']} label="CVC" rules={[{ required: true, type: 'number', min:0, max:999 }]}>
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col span={10}>

                        <Form.Item name={['payment', 'month']} label="Exp Month" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select an option"
                                allowClear
                                options={monthOptions}
                            >
                            </Select>

                        </Form.Item>

                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="primary" htmlType="submit">
                                    Create Profile
                                </Button>
                        </Form.Item>
                    </Col>

                    <Col span={10}>
                        <Form.Item name={['payment', 'year']} label="Exp Year" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select an option"
                                allowClear
                                options={yearOptions}
                            >
                            </Select>

                        </Form.Item>


                    </Col>
                </Row>
            </Form>
        </Row>
    </div>
    )
}

export default BillingPage;
