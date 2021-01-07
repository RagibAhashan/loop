import React, { useState, useEffect } from 'react';
import { Row, Col, Divider, Input, Form, Select, InputNumber, Button, Checkbox } from 'antd';

  const layout = {
    labelCol: { span: 8 },
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

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const BillingPage = () => {

    const [yearOptions, setYearOptions] = useState([]);
    const [same, setSame] = useState(false);

    useEffect(() => {        
        setYearOptions(getYears())
    }, []);

    const onFinish = (values: any) => {
          console.log(values);
    };



    return (
        <div>
            

            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
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
                                        console.log('same', same)
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
                                // onChange={onGenderChange}
                                allowClear
                                options={monthOptions}
                            >
                            </Select>

                        </Form.Item>

                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="primary" htmlType="submit">
                                    Add Profile
                                </Button>
                        </Form.Item>
                    </Col>

                    <Col span={10}>
                        <Form.Item name={['payment', 'year']} label="Exp Year" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select an option"
                                // onChange={onGenderChange}
                                allowClear
                                options={yearOptions}
                            >
                            </Select>

                        </Form.Item>

                        
                    </Col>
                </Row>
            </Form>

        </div>
    )
}

export default BillingPage;