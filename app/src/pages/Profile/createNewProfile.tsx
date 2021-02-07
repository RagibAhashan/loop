import React, { useState } from 'react';
import { Modal, Button, Tabs, Input, Row, Col, Form, Divider, Select, Checkbox } from 'antd';
import Cards from 'react-credit-cards';

const { TabPane } = Tabs;


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
        { value: '12', label: '12' }
    ];
};

const CreateNewProfileModal = (props: any) => {
    const { onFinish } = props;
    const [same, setSame] = useState(false);
    const [front, setFront] = useState(true);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [shipFirstName, setshipFirstName] = useState('');
    const [shipLastname, setshipLastName] = useState('');

    const [billFirstName, setFirstName] = useState('');
    const [billLastname, setLastName] = useState('');

    const [creditCard, setCreditCard] = useState('');
    const [cvc, setCvc] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');



    const callback = (key: any) => {
        console.log(key);
      }    


    
      const handleOk = () => {
        setIsEditModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsEditModalVisible(false);
      };
    
      const changeMonth = (value: any) => {
        setMonth(prev => prev = value);
        setFront(true);
      }

      const changeYear = (value: any) => {
        setYear(prev => prev = value)
        setFront(true);
      }

    return (
        <div>
            <Button
                type="primary"
                onClick={() => setIsEditModalVisible(true)}
            > Create Profile </Button>
            <Modal 
                title="Create a new profile"
                visible={isEditModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={false}
            >
            <Form name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <Tabs defaultActiveKey="1" onChange={callback} >
                    
                    <TabPane tab="Profile and Shipping" key="1" >
                        <Row>
                            <Form.Item name="profile" rules={[{ required: true }]}>
                                <Input 
                                    placeholder={'Profile name'}
                                    style={{ width: '400px', margin: '1%', height: '40px' }}
                                    
                                />
                            </Form.Item>
                        </Row>
                        <br />
                        <Row>
                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={['shipping', 'firstname']} rules={[{ required: true }]}>
                                    <Input placeholder={'First name'} style={{ height: '40px'}}
                                        onChange={(e) => {
                                            setshipFirstName((prev) => (prev = e.target.value));
                                            if (!front) {
                                                setFront((prev) => (prev = true));
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                    <Input placeholder={'Last name'} style={{ height: '40px'}}
                                        onChange={(e) => {
                                            setshipLastName((prev) => (prev = e.target.value));
                                            if (!front) {
                                                setFront((prev) => (prev = true));
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={['shipping', 'phone']} rules={[{ required: true }]}>
                                    <Input placeholder={'Phone'} style={{ height: '40px'}}
                                        type='number'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={['shipping', 'email']} rules={[{ required: true }]}>
                                    <Input placeholder={'Email'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={['shipping', 'address']} rules={[{ required: true }]}>
                                    <Input placeholder={'Address'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={['shipping', 'city']} rules={[{ required: true }]}>
                                    <Input placeholder={'City'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={['shipping', 'postalcode']} rules={[{ required: true }]}>
                                    <Input placeholder={'Postal Code'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={['shipping', 'province']} rules={[{ required: true }]}>
                                    <Input placeholder={'Province'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>



                    </TabPane>



                    <TabPane tab="Payment Information" key="2">
                        <Row>
                            <Col style={{ width: '30%', margin: '1%'}}>
                            <Form.Item name={[same ? 'shipping' : 'billing', 'firstname']} rules={[{ required: true }]}>
                                <Input placeholder={'First name'} style={{ height: '40px'}}
                                    onChange={(e) => {
                                        setFirstName((prev) => (prev = e.target.value));
                                        if (!front) {
                                            setFront((prev) => (prev = true));
                                        }
                                    }}
                                />
                            </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={[same ? 'shipping' : 'billing', 'lastname']} rules={[{ required: true }]}>
                                    <Input placeholder={'Last name'} style={{ height: '40px'}}
                                        onChange={(e) => {
                                            setLastName((prev) => (prev = e.target.value));
                                            if (!front) {
                                                setFront((prev) => (prev = true));
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={[same ? 'shipping' : 'billing', 'phone']} rules={[{ required: true }]}>
                                    <Input placeholder={'Phone'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={[same ? 'shipping' : 'billing', 'email']} rules={[{ required: true, type: 'email' }]}>
                                    <Input placeholder={'email'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={[same ? 'shipping' : 'billing', 'address']} rules={[{ required: true }]}>
                                    <Input placeholder={'Address'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={[same ? 'shipping' : 'billing', 'city']} rules={[{ required: true }]}>
                                    <Input placeholder={'City'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={[same ? 'shipping' : 'billing', 'postalcode']} rules={[{ required: true }]}>
                                    <Input placeholder={'Postal Code'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item name={[same ? 'shipping' : 'billing', 'province']} rules={[{ required: true }]}>
                                    <Input placeholder={'Province'} style={{ height: '40px'}}
                                    />
                                </Form.Item>
                            </Col>

                            <Col style={{ width: '30%', margin: '1%'}}>
                                <Form.Item wrapperCol={{ ...layout.wrapperCol}} name="same" valuePropName="checked">
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
                                    <Input style={{ width: '100%', height: '40px'}}
                                        type="number"
                                        placeholder={'Credit Card'}
                                        onChange={(e) => {
                                            setCreditCard((prev) => (prev = e.target.value));
                                            if (!front) {
                                                setFront((prev) => (prev = true));
                                            }
                                        }}
                                    />
                                </Form.Item>
                                </Col>
                                <Col span={6} style={{ marginLeft: '1%'}}>
                                    <Form.Item name={['payment', 'cvc']} rules={[{ required: true, min: 0, max: 999 }]}>
                                        <Input style={{ width: '100%', height: '40px'}}
                                            placeholder={'CVC'}
                                            type='number'
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
                            <Row style={{marginTop: '-30px'}}>
                                <Col span={10}>
                                    <Form.Item name={['payment', 'month']} rules={[{ required: true }]}>
                                        <Select
                                            style={{ width: '100%'}}
                                            placeholder="Expiration Month" allowClear options={getMonths()}
                                            onChange={changeMonth}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={10} style={{ marginLeft: '1%'}}>
                                    <Form.Item name={['payment', 'year']} rules={[{ required: true }]}>
                                        <Select
                                            style={{ width: '100%'}}
                                            placeholder="Expiration Year" allowClear options={getYears()}
                                            onChange={changeYear}
                                        />
                                    </Form.Item>

                                    <Form.Item style={{float: 'right'}}>
                                        <Button type="primary" htmlType="submit" style={{ width: '400px', height: '40px'}}>
                                            Create Profile
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>

                        </Row>

                    </TabPane>

                    
                </Tabs>

                
            </Form>



            </Modal>
        </div>
    )
}

export default CreateNewProfileModal;
