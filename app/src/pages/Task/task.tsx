import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';

const input_field = {
    height:'48px',
    borderRadius:'6px',
    backgroundColor:'#282C31',
    border:'1px solid #858C94'
}

const col_styles = {
    marginLeft: '10px'
}

const TaskComponent = (props: any) => {
    // const { Header, Content } = Layout;


    return (
            <div style={{backgroundColor:'#212427'}}>
                
                <Form style={{backgroundColor:'#212427'}} >

                                <Row>
                                    <Col style={{width: '320px'}}>
                                        <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                            <Input
                                                placeholder='keyword'
                                                style={input_field}
                                                />
                                        </Form.Item>
                                    </Col>

                                    <Col  style={{marginLeft: '50px', width: '120px'}}>
                                    <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                        <Input
                                            placeholder='Start Date'
                                            style={input_field}
                                            />
                                    </Form.Item>
                                    </Col>
                                    
                                    <Col  style={{marginLeft: '30px', width: '120px'}}>
                                        <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                            <Input
                                                placeholder='Start Time'
                                                style={input_field}
                                                />
                                        </Form.Item>
                                    </Col>
                                    <Col style={{marginLeft: '30px', width: '150px'}}>

                                    <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                        <Input
                                            placeholder='Profile Set'
                                            style={input_field}
                                            />
                                    </Form.Item>
                                    </Col>
                                    </Row>

                                    <Row>
                                        <Col style={{width: '320px'}}>
                                            <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                                <Input
                                                    placeholder='Size'
                                                    style={input_field}
                                                    />
                                            </Form.Item>
                                        </Col>

                                        <Col  style={{marginLeft: '50px', width: '270px'}}>
                                            <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                                <Input
                                                    placeholder='Size'
                                                    style={input_field}
                                                    />
                                            </Form.Item>
                                        </Col>

                                        <Col style={{marginLeft: '30px', width: '150px'}}>
                                            <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                                <Input
                                                    placeholder='Size'
                                                    style={input_field}
                                                    />
                                            </Form.Item>
                                        </Col>
                                    </Row>



                                    <Row>
                                        <Col style={{width: '320px'}}>
                                            <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                                <Input
                                                    placeholder='Size'
                                                    style={input_field}
                                                    />
                                            </Form.Item>
                                        </Col>

                                        <Col  style={{marginLeft: '50px', width: '270px'}}>
                                            <Form.Item name={['shipping', 'lastname']} rules={[{ required: true }]}>
                                                <Input
                                                    placeholder='Size'
                                                    style={input_field}
                                                    />
                                            </Form.Item>
                                        </Col>

                                        <Col style={{marginLeft:'30px'}}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Create tasks
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                </Form>

            <div style={{
                border: '1px solid #4D4D4D',
                borderRadius: '13px',
                backgroundColor: '#282C31',
                minHeight: '100vh',
                minWidth: '100vh'
            }}>
                Active tasks here
            </div>
        </div>
    )
}

export default TaskComponent;