import React, { useCallback, useState } from 'react';
import { Modal, Button, Form, Row, Col, Input, TimePicker, DatePicker, Select, Space } from 'antd';
const { Option } = Select;

const validateMessages = {
    required: 'Required!',
    types: {
        email: '${name} is not a valid email!',
        number: '${name} is not a valid number!',
    },
    number: {
        range: '${name} must be 3 digits or less.',
    },
};

const format = 'HH:mm';

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

const buttonStyle: React.CSSProperties = {
    width: '20%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};


const getProfiles = () => {
    const profilesTemp: any = [];
    let profs: any = localStorage.getItem('profiles');

    if (profs) {
        profs = JSON.parse(profs);
        if (profs) {
            profs.map((p: any) => {
                console.log(p);
                profilesTemp.push({
                    label: p['profile'].toString(),
                    value: p['profile'].toString(),
                });
            });
        }
    }

    return profilesTemp;
};

const NewTaskModal = (props: any) => {
    const { store, addTasks, proxies } = props;
    const [visible, setVisible] = useState(false);
    // const [proxies, setProxies] = useState([]);

    const ROW_GUTTER: [number, number] = [24, 0];

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({} as any), []);

    function onChange(date: any, dateString: any) {
        console.log(date, dateString);
    }

    const onFinishForm = (data:any) => {
        addTasks(data);
        setVisible(false)
    }


  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Add Task
      </Button>
      <Modal
        title={store}
        centered
        visible={visible}
        onOk={() => addTasks}
        onCancel={() => setVisible(false)}
        // okButtonProps={{ disabled: true }}
        okText="Create tasks"
        footer={false}
        width={700}
      >
        <Form onFinish={onFinishForm} validateMessages={validateMessages}>
            <Form.Item name={['task', 'keyword']} rules={[{ required: true }]}>
                <Input placeholder="keyword" />
            </Form.Item>

            <Row>
                <Col style={{ }}>
                    <Form.Item name={['task', 'startdate']} rules={[{ required: true }]}>
                        <DatePicker onChange={onChange} />
                    </Form.Item>
                </Col>
                <Col style={{ marginLeft: '10px', width: '30%'}}>
                    <Form.Item style={{ width: '100%' }} name={['task', 'starttime']} rules={[{ required: true }]}>
                        <TimePicker style={{ width: '100%' }} format={format} />
                    </Form.Item>
                </Col>
                <Col style={{ marginLeft: '10px', width: '46%'}}>
                    <Form.Item name={['task', 'profile']} rules={[{ required: true }]}>
                        {/* <Input placeholder="Profile Set" /> */}
                        <Select style={{ width: '100%'}} placeholder="Profile" allowClear 
                            options={getProfiles()}
                            // options={[
                            // {label: 'hello', value: 'hello'},
                            // {label: 'hello1', value: 'hello'},
                            // {label: 'hello2', value: 'hello'},
                            // {label: 'hello3', value: 'hello'}
                            // ]} 
                        />
                    </Form.Item>    
                </Col>
            </Row>


            <Row>
                <Col style={{ width: '50%'}}>
                    <Form.Item name={['task', 'sizes']} rules={[{ required: true }]}>
                        <Select style={{ width: '100%%'}} placeholder="Size" mode="multiple" allowClear>
                            {allSizes}
                        </Select>
                    </Form.Item>
                </Col>

                <Col style={{ marginLeft:'1%', width: '49%'}}>
                    <Form.Item name={['task', 'proxyset']} rules={[{ required: false }]}>
                        <Select style={{ width: '100%'}} placeholder="Proxy Set" allowClear options={proxies} defaultValue={'Localhost'} />
                    </ Form.Item>
                </Col>
            </Row>

            <Row>
                <Space>

                <Col>
                    <Form.Item name={['task', 'monitordelay']} rules={[{ required: true }]}>
                        <Input placeholder="Monitor delay in milliseconds" type="number" />
                    </Form.Item>
                </Col>

                <Col>
                    <Form.Item name={['task', 'retrydelay']} rules={[{ required: true }]}>
                        <Input placeholder="Retry delay" type="number" />
                    </Form.Item>
                </Col>
                </Space>
            </Row>


            <Form.Item style={{ width: '40%' }} name={['task', 'quantity']} label='Number of tasks' rules={[{ required: true }]}>
                <Input placeholder="Quantity"  type="number"/>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ ...buttonStyle, float: 'right' }}
                >
                    Add tasks
                </Button>
            </Form.Item>


        </Form>
      </Modal>
    </>
  );
};

export default NewTaskModal;
