// import { Button, Checkbox, Col, Divider, Form, Input, Modal, Row, Select } from 'antd';
// import React, { useState } from 'react';
// import Cards from 'react-credit-cards';

// const validateMessages = {
//     required: '${label} is required!',
//     types: {
//         email: '${label} is not a valid email!',
//         number: '${label} is not a valid number!',
//     },
//     number: {
//         range: '${label} must be 3 digits or less.',
//     },
// };

// const layout = {
//     labelCol: { span: 5 },
//     wrapperCol: { span: 16 },
// };

// const UserFormData = {
//     profile: '',
//     same: false,
//     shipping: {
//         address: '88 address',
//         city: '88 city',
//         email: '88 email',
//         firstname: '88 email',
//         lastname: '88 email',
//         phone: '88 email',
//         postalcode: '88 email',
//         province: '88 email',
//     },

//     billing: {
//         address: '88 billing',
//         city: '88 billing',
//         email: '88 billing',
//         firstname: '88 billing',
//         lastname: '88 billing',
//         phone: '88 billing',
//         postalcode: '88 billing',
//         province: '88 billing',
//     },

//     payment: {
//         credit: 'dasd',
//         cvc: 'dasd',
//         month: 'asd',
//         year: 'asdasd',
//     },
// };

// const monthOptions = [
//     { value: 1, label: 1 },
//     { value: 2, label: 2 },
//     { value: 3, label: 3 },
//     { value: 4, label: 4 },
//     { value: 5, label: 5 },
//     { value: 6, label: 6 },
//     { value: 7, label: 7 },
//     { value: 8, label: 8 },
//     { value: 9, label: 9 },
//     { value: 10, label: 9 },
//     { value: 11, label: 11 },
//     { value: 12, label: 12 },
// ];

// const getYears = (): any => {
//     const year = new Date().getFullYear();
//     let years = [];
//     for (let i = year; i < year + 15; i++) {
//         years.push({
//             value: i,
//             label: i,
//         });
//     }
//     return years;
// };

// const CreateNewProfileModal = (props: any) => {
//     const { onFinish } = props;
//     const [yearOptions, setYearOptions] = useState(getYears());
//     const [visible, setVisible] = useState(false);
//     const [same, setSame] = useState(false);

//     const [shipFirstName, setshipFirstName] = useState('');
//     const [shipLastname, setshipLastName] = useState('');

//     const [billFirstName, setFirstName] = useState('');
//     const [billLastname, setLastName] = useState('');

//     const [creditCard, setCreditCard] = useState('');
//     const [cvc, setCvc] = useState('');
//     const [month, setMonth] = useState('');
//     const [year, setYear] = useState('');

//     const [front, setFront] = useState(true);

//     return (
//         <>
//             <Button type="primary" onClick={() => setVisible(true)}>
//                 Add Profile
//             </Button>
//             <Modal
//                 title="Create new profile"
//                 centered
//                 visible={visible}
//                 onOk={() => setVisible(false)}
//                 onCancel={() => setVisible(false)}
//                 width={1000}
//             >
//                 <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} style={{ marginTop: '30px' }}>
//                     <Row>
//                         <Col span={12}>
//                             <Form.Item name="profile" label="Profile Name" rules={[{ required: true }]}>
//                                 <Input placeholder="" />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Row>
//                         <Col span={12}>
//                             <Divider> Shipping Address </Divider>
//                             <Form.Item name={['shipping', 'firstname']} rules={[{ required: true }]}>
//                                 <Input
//                                     placeholder="First Name"
//                                     onChange={(e) => {
//                                         setshipFirstName((prev) => (prev = e.target.value));
//                                         if (!front) {
//                                             setFront((prev) => (prev = true));
//                                         }
//                                     }}
//                                 />
//                             </Form.Item>

//                             <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
//                                 <Input
//                                     placeholder="Last Name"
//                                     onChange={(e) => {
//                                         setshipLastName((prev) => (prev = e.target.value));
//                                         if (!front) {
//                                             setFront((prev) => (prev = true));
//                                         }
//                                     }}
//                                 />
//                             </Form.Item>

//                             <Form.Item name={['shipping', 'phone']} rules={[{ required: true }]}>
//                                 <Input placeholder="Phone" type="number" />
//                             </Form.Item>

//                             <Form.Item name={['shipping', 'email']} rules={[{ required: true, type: 'email' }]}>
//                                 <Input placeholder="Email" />
//                             </Form.Item>

//                             <Form.Item name={['shipping', 'address']} rules={[{ required: true }]}>
//                                 <Input placeholder="Address" />
//                             </Form.Item>

//                             <Form.Item name={['shipping', 'city']} rules={[{ required: true }]}>
//                                 <Input placeholder="City" />
//                             </Form.Item>

//                             <Form.Item name={['shipping', 'postalcode']} rules={[{ required: true }]}>
//                                 <Input placeholder="Postal Code" />
//                             </Form.Item>

//                             <Form.Item name={['shipping', 'province']} rules={[{ required: true }]}>
//                                 <Input placeholder="Province" />
//                             </Form.Item>
//                         </Col>

//                         <Col span={12}>
//                             <Divider> Billing Address </Divider>
//                             <Form.Item name={[same ? 'shipping' : 'billing', 'firstname']} rules={[{ required: true }]}>
//                                 <Input
//                                     placeholder="First Name"
//                                     onChange={(e) => {
//                                         setFirstName((prev) => (prev = e.target.value));
//                                         if (!front) {
//                                             setFront((prev) => (prev = true));
//                                         }
//                                     }}
//                                 />
//                             </Form.Item>

//                             <Form.Item name={[same ? 'shipping' : 'billing', 'lastname']} rules={[{ required: true }]}>
//                                 <Input
//                                     placeholder="Last Name"
//                                     onChange={(e) => {
//                                         setLastName((prev) => (prev = e.target.value));
//                                         if (!front) {
//                                             setFront((prev) => (prev = true));
//                                         }
//                                     }}
//                                 />
//                             </Form.Item>

//                             <Form.Item name={[same ? 'shipping' : 'billing', 'phone']} rules={[{ required: true }]}>
//                                 <Input placeholder="Phone" type="number" />
//                             </Form.Item>
//                             <Form.Item name={[same ? 'shipping' : 'billing', 'email']} rules={[{ required: true, type: 'email' }]}>
//                                 <Input placeholder="Email" />
//                             </Form.Item>

//                             <Form.Item name={[same ? 'shipping' : 'billing', 'address']} rules={[{ required: true }]}>
//                                 <Input placeholder="Address" />
//                             </Form.Item>

//                             <Form.Item name={[same ? 'shipping' : 'billing', 'city']} rules={[{ required: true }]}>
//                                 <Input placeholder="City" />
//                             </Form.Item>

//                             <Form.Item name={[same ? 'shipping' : 'billing', 'postalcode']} rules={[{ required: true }]}>
//                                 <Input placeholder="Postal Code" />
//                             </Form.Item>

//                             <Form.Item name={[same ? 'shipping' : 'billing', 'province']} rules={[{ required: true }]}>
//                                 <Input placeholder="Province" />
//                             </Form.Item>

//                             <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }} name="same" valuePropName="checked">
//                                 <Checkbox
//                                     checked={same}
//                                     onChange={(e) => {
//                                         setSame(e.target.checked);
//                                     }}
//                                 >
//                                     Same as shipping address
//                                 </Checkbox>
//                             </Form.Item>
//                         </Col>

//                         <Col span={10}>
//                             <Form.Item name={['payment', 'credit']} rules={[{ required: true }]}>
//                                 <Input.Password
//                                     placeholder="Credit Card"
//                                     onChange={(e) => {
//                                         setCreditCard((prev) => (prev = e.target.value));
//                                         if (!front) {
//                                             setFront((prev) => (prev = true));
//                                         }
//                                     }}
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={10}>
//                             <Form.Item name={['payment', 'cvc']} rules={[{ required: true, min: 0, max: 999 }]}>
//                                 <Input
//                                     placeholder="CVC"
//                                     onChange={(e) => {
//                                         setCvc((prev) => (prev = e.target.value));
//                                         if (front) {
//                                             setFront((prev) => (prev = false));
//                                         }
//                                     }}
//                                 />
//                             </Form.Item>
//                         </Col>
//                         <Col span={10}>
//                             <Form.Item name={['payment', 'month']} rules={[{ required: true }]}>
//                                 <Select placeholder="Expiration Month" allowClear options={monthOptions}></Select>
//                             </Form.Item>

                            // <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                            //     <Button type="primary" htmlType="submit">
                            //         Create Profile
                            //     </Button>
                            // </Form.Item>
//                         </Col>

//                         <Col span={10}>
//                             <Form.Item name={['payment', 'year']} rules={[{ required: true }]}>
//                                 <Select placeholder="Expiration Year" allowClear options={yearOptions}></Select>
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Cards
//                         cvc={cvc}
//                         expiry={`${month}${year}`}
//                         focused={front ? 'number' : 'cvc'}
//                         name={same ? shipFirstName + ' ' + shipLastname : billFirstName + ' ' + billLastname}
//                         number={creditCard}
//                     />
//                 </Form>
//             </Modal>
//         </>
//     );
// };

// export default CreateNewProfileModal;


import React, { useState, useEffect } from 'react';
import { Modal, Button, Tabs, message, Input, Row, Col, Form, Divider, Select, Checkbox } from 'antd';
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
    let months = [];
    for (let i = 1; i <= 12; i++) {
        months.push({
            value: i,
            label: i,
        });
    }
    return months;
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
    
      const data: any = {};

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
                                        placeholder={'Credit Card'}
                                        type='number'
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
                                            placeholder="Expiration Year" allowClear options={getMonths()}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={10} style={{ marginLeft: '1%'}}>
                                    <Form.Item name={['payment', 'year']} rules={[{ required: true }]}>
                                        <Select
                                            style={{ width: '100%'}}
                                            placeholder="Expiration Year" allowClear options={getYears()}
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
