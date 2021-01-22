import { Button, Col, DatePicker, Form, Input, Layout, Row, Select, TimePicker } from 'antd';
import React from 'react';
import Bot from './bot';

const { Option } = Select;

const format = 'HH:mm';

const colStyle = {
    margin: 'auto',
};

const botStyle = {
    backgroundColor: 'black',
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '10px',
    height: '45px',
    borderRadius: '6px',
};

const input_field = {
    height: '39px',
    // borderRadius: '6px',
    // backgroundColor: '#282C31',
    // border: '1px solid #858C94',
};

function onChange(date: any, dateString: any) {
    console.log(date, dateString);
}

const allSizes: any[] = [];
for (let i = 4; i < 14; i += 0.5) {
    allSizes.push(
        <Option value={i.toString()} key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

let dummy: any[] = [];

for (let i = 0; i < 40; i++) dummy.push(i);

const TaskComponent = (props: any) => {
    const { Content } = Layout;

    return (
        <div>
            <Form style={{ height: '20vh' }}>
                <Row>
                    <Col style={{ width: '320px' }}>
                        <Form.Item name={['task', 'keyword']} rules={[{ required: true }]}>
                            <Input placeholder="keyword" style={input_field} />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '50px', width: '140px' }}>
                        <Form.Item name={['task', 'startdate']} rules={[{ required: true }]}>
                            <DatePicker onChange={onChange} style={input_field} />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '30px', width: '120px' }}>
                        <Form.Item name={['task', 'starttime']} rules={[{ required: true }]}>
                            <TimePicker style={input_field} format={format} />
                        </Form.Item>
                    </Col>
                    <Col style={{ marginLeft: '30px', width: '210px' }}>
                        <Form.Item name={['task', 'profile']} rules={[{ required: true }]}>
                            <Input placeholder="Profile Set" style={input_field} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col style={{ width: '320px' }}>
                        <Form.Item name={['task', 'sizes']} rules={[{ required: true }]}>
                            <Select placeholder="Size" style={input_field} mode="multiple" allowClear>
                                {allSizes}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '50px', width: '290px' }}>
                        <Form.Item name={['task', 'proxyset']} rules={[{ required: true }]}>
                            <Input placeholder="Proxy Set" style={input_field} />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '30px', width: '210px' }}>
                        <Form.Item name={['task', 'quantity']} rules={[{ required: true }]}>
                            <Input placeholder="Quantity" style={input_field} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col style={{ width: '320px' }}>
                        <Form.Item name={['task', 'monitordelay']} rules={[{ required: true }]}>
                            <Input placeholder="Monitor delay in milliseconds" style={input_field} type="number" />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '50px', width: '290px' }}>
                        <Form.Item name={['task', 'retrydelay']} rules={[{ required: true }]}>
                            <Input placeholder="Retry delay" style={input_field} type="number" />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '30px' }}>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    backgroundColor: '#000000',
                                    // backgroundColor: '#282C31',
                                    color: '#F0A30D',
                                    height: '39px',
                                    width: '210px',
                                    // borderRadius: '6px',
                                    borderColor: '#F0A30D',
                                }}
                            >
                                Create tasks
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Row>
                <Col span={3} style={{ marginLeft: '10px' }}>
                    <Button style={{ height: '40px', width: '100px', color: 'green', borderColor: 'green', border: '1px solid', fontSize: '14px' }}>
                        {' '}
                        Run all{' '}
                    </Button>
                </Col>
                <Col span={3}>
                    <Button style={{ height: '40px', width: '100px' }} danger>
                        {' '}
                        Stop all{' '}
                    </Button>
                </Col>
                <Col span={13}></Col>
                <Col span={3}>
                    <Button style={{ height: '40px', width: '170px' }} type="primary" danger>
                        {' '}
                        Delete all{' '}
                    </Button>
                </Col>
            </Row>

            <div
                style={{
                    border: '1px solid #4D4D4D',
                    borderRadius: '6px',
                    backgroundColor: '#282C31',
                    width: '100%',
                    marginTop: '10px',
                    height: '60vh',
                }}
            >
                <Row style={botStyle}>
                    <Col span={3} style={{ margin: 'auto', marginLeft: '10px' }}>
                        Store
                    </Col>

                    <Col span={3} style={colStyle}>
                        Product
                    </Col>

                    <Col span={2} style={colStyle}>
                        Size
                    </Col>

                    <Col span={3} style={colStyle}>
                        Profile
                    </Col>

                    <Col span={4} style={colStyle}>
                        Proxy
                    </Col>

                    <Col span={4} style={colStyle}>
                        Status
                    </Col>

                    <Col span={4} style={colStyle}>
                        Actions
                    </Col>
                </Row>

                <div
                    style={{
                        overflow: 'auto',
                        height: '53vh',
                    }}
                >
                    {dummy.map((val) => (
                        <Bot store={`FootLocker ${val}`} size={val.toString()} profile={'BMO'} ip={'Local Host'} product={'Dunker'} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskComponent;
