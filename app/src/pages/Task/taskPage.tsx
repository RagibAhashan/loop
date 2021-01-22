import React, { useState, useEffect } from 'react';
import TaskSideBar from './TaskSideBar'
import { Layout, Row, Col } from 'antd';
import TaskComponent from './task'


const TaskPage = () => {
    const { Sider, Content } = Layout;



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
                Discord
            </Col>
        </Row>

        <Row style={{marginTop: '0px'}}>
                <TaskComponent />
        </Row>
            </Content>
        
    </Layout>
        </div>
    )
}

export default  TaskPage;