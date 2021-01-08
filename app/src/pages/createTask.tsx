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


const children: any[] = [];
for (let i = 4; i < 15; i += 0.5) {
    children.push(<Option key={i.toString()}>{'Size ' + i.toString()}</Option>);
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
                            // onChange={handleChange}
                        >
                            {children}
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
                        // onChange={handleChange}
                    >
                        {children}
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
                            // onChange={handleChange}
                        >
                            {children}
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