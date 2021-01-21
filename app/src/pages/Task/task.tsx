import React, { useState, useEffect } from 'react';
import TaskSideBar from './TaskSideBar'
import { Layout, Form } from 'antd';



const TaskPage = () => {
    const { Header, Footer, Sider, Content } = Layout;



    return (
        <div>


    <Layout>
        <Sider>
            <TaskSideBar />
        </Sider>
        <Layout>
            <Header>
                Form Here
            </Header>    
            <Content>
                Content here
            </Content>




        </Layout>
    </Layout>
        </div>
    )
}

export default  TaskPage;