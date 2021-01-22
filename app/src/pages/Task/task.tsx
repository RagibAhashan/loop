import { Button, Col, DatePicker, Form, Input, Row, Select, TimePicker } from 'antd';
import React from 'react';
const { Option } = Select;

const format = 'HH:mm';

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
        <Option value="" key={i.toString()}>
            {i.toString()}
        </Option>,
    );
}

const TaskComponent = (props: any) => {
    return (
        <div>
            <Form>
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
                    <Col style={{ marginLeft: '30px', width: '150px' }}>
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

                    <Col style={{ marginLeft: '30px', width: '150px' }}>
                        <Form.Item name={['task', 'quantity']} rules={[{ required: true }]}>
                            <Input placeholder="Quantity" style={input_field} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col style={{ width: '320px' }}>
                        <Form.Item name={['task', 'monitordelay']} rules={[{ required: true }]}>
                            <Input placeholder="Monitor delay" style={input_field} />
                        </Form.Item>
                    </Col>

                    <Col style={{ marginLeft: '50px', width: '290px' }}>
                        <Form.Item name={['task', 'retrydelay']} rules={[{ required: true }]}>
                            <Input placeholder="Retry delay" style={input_field} />
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
                                    width: '150px',
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

            <div
                style={{
                    border: '1px solid #4D4D4D',
                    borderRadius: '13px',
                    backgroundColor: '#282C31',
                    minHeight: '100vh',
                    minWidth: '100vh',
                }}
            >
                tasks here
            </div>
        </div>
    );
};

export default TaskComponent;
