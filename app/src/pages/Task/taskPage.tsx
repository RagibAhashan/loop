import React, { useState, useEffect } from 'react';
import TaskSideBar from './TaskSideBar'
import { Layout, Row, Col, Button, Popconfirm, message } from 'antd';
import TaskComponent from './task'


const text = 'Are you sure to delete this store?\nAll running tasks will be terminated.'

const TaskPage = () => {
    const { Sider, Content } = Layout;

    function confirm() {
        message.success('Store deleted!');
    }

    return (
        <div>


    <Layout>
        <Sider style={{backgroundColor: '#282C31'}}>
            <TaskSideBar />
        </Sider>
            <Content style={{marginLeft:'50px', marginRight:'50px'}}>
                <Row style={{marginTop: '15px', marginBottom: '-20px'}}>
                    <Col span={8}>
                        <p style={{fontSize: '35px', color: 'orange'}}>
                            Footlocker Tasks
                        </p>
                    </Col>
                    <Col span={8} offset={8}>
                        
                        <div style={{marginLeft : '185px'}}>
                            <Popconfirm placement="bottom" title={text} onConfirm={confirm} okText="Yes" cancelText="No">
                            <Button type="primary" danger
                                style={{
                                    marginTop: '10px',
                                    height: '39px'
                                }}
                                >
                                Delete Store
                            </Button>
                            </ Popconfirm>
                                {/* Discord Here */}
                        </div>
                    </Col>
                </Row>

                <Row style={{marginTop: '0px', height: '100%'}}>
                    <Col span={24}>
                        <TaskComponent />
                    </Col>
                </Row>
            </Content>
        
    </Layout>
        </div>
    )
}

export default  TaskPage;