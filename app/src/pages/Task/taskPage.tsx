import React, { useState, useEffect } from 'react';
import TaskSideBar from './TaskSideBar'
import { Layout, Row, Col } from 'antd';
import TaskComponent from './task'


const TaskPage = () => {
    const { Sider, Header, Content } = Layout;



    return (
        <div>


    <Layout>
        <Sider style={{backgroundColor: '#282C31'}}>
            <TaskSideBar />
        </Sider>

        <Header style={{backgroundColor:'#212427'}}>
            Tasks

        <Content >
            <TaskComponent />
        </Content>

        </Header>
        
    </Layout>
        </div>
    )
}

export default  TaskPage;