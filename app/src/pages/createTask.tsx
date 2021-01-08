import React, { useState, useEffect } from 'react';
import { Row, Col, Divider, Input, Form, Select, InputNumber, Button, Checkbox, message, Card, Space, Popover } from 'antd';


const layout = {
    labelCol: { span: 4 },
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


const shoe_size: any[] = [];
let option_profiles: any[] = [];

let saved_profiles = localStorage.getItem('profiles');
saved_profiles = localStorage.getItem('profiles');
option_profiles = []
if (saved_profiles) {
    saved_profiles = JSON.parse(saved_profiles);
    for(let i=0; i < saved_profiles.length; i++) {
        option_profiles.push(<Option key={saved_profiles[i].profile}> {saved_profiles[i].profile} </Option>)
    }
}

for (let i = 4; i < 15; i += 0.5) {
    shoe_size.push(<Option key={i.toString()}>{'Size ' + i.toString()}</Option>);
}

const CreateTaskPage = () => {

    const [newTask, setTask] = useState({
        store: 'Foot Locker',
        number_tasks: 0,
        profile: '',
        proxies: '',
        sizes: 0,
        sku: 0,
    });

    useEffect(() => {
        let saved_profiles = localStorage.getItem('profiles');
        saved_profiles = localStorage.getItem('profiles');
        option_profiles = []
        if (saved_profiles) {
            saved_profiles = JSON.parse(saved_profiles);
            for(let i=0; i < saved_profiles.length; i++) {
                option_profiles.push(<Option key={saved_profiles[i].profile}> {saved_profiles[i].profile} </Option>)
            }
        }
    }, [])

    const onFinish = (value: any) => {
        console.log(value);
        setTask(value);
        console.log('task', newTask)
    }


    return (
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} style={{marginTop:'30px'}}>
            <Divider> Create Task </Divider>
            <Row>
                <Col span={12}>
                    <Form.Item name={['task', 'productlink']} label='Prod Link' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>

                    <Form.Item name={['task', 'profile']} label='Profile' rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select your profiles"
                            defaultValue={[]}
                        >
                            {option_profiles}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>


            <Row>
                <Col span={12}>
                    <Form.Item name={['task', 'sku']} label='SKU' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>

                    <Form.Item name={['task', 'sizes']} label='Size Range' rules={[{ required: true }]}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        defaultValue={[]}
                    >
                        {shoe_size}
                    </Select>
                    </Form.Item>
                </Col>
            </Row>


            <Row>
                <Col span={12}>
                    <Form.Item name={['task', 'proxies']} label='Proxy Set' rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select your proxy set"
                            defaultValue={[]}
                        >
                            {/* {children} */}
                        </Select>
                    </Form.Item>

                    

                </Col>
                <Col span={12}>
                
                    <Form.Item name={['task', 'number_tasks']} label='N Tasks' rules={[{ required: true, type: 'number', min: 0}]}>
                        <InputNumber />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }} rules={[{ required: true,  }]}>
                <Button type="primary" htmlType="submit">
                    Create Task
                </Button>
            </Form.Item>
            


        </ Form>
    )
}

export default CreateTaskPage;