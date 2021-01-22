import React, { useState, useEffect } from 'react';
import TaskSideBar from './TaskSideBar'
import { Layout, Row, Col } from 'antd';
import TaskComponent from './task'


const TaskPage = () => {
    const { Sider, Content } = Layout;



    return (
        <div>


    <Layout>
        <Sider 
            style={{backgroundColor: '#282C31'}}
        >
            <TaskSideBar />
        </Sider>
            <Content style={{marginLeft:'50px', marginRight:'50px'}}>

        <Row style={{marginTop: '15px'}}>
            <Col span={8}>
                Tasks
            </Col>
            <Col span={8} offset={8}>
                Discord
            </Col>
        </Row>

        <Row style={{marginTop: '30px'}}>
                <TaskComponent />
        </Row>
            </Content>

        {/* </Header> */}
        
    </Layout>
        </div>
    )
}

export default  TaskPage;