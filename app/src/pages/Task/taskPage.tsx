import { Button, Col, Layout, message, Popconfirm, Row, Tabs, Table, Space, Tag } from 'antd';
import React from 'react';
import Store from './task';
// import Store from './TaskSideBar';

const text = 'Are you sure to delete this store?\nAll running tasks will be terminated.';


const TaskPage = () => {
    const { TabPane } = Tabs;

    const columns = [
        {
            title: 'Store',
            dataIndex: 'name',
            key: 'name',
            render: (text: any) => <a>{text}</a>,
        },
        {
            title: 'Product',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Size',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Profile',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Proxy Set',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Status',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    function callback(key: any) {
        console.log(key);
    }




    const onChange = () => {};

    const { Sider, Content, Header } = Layout;

    return (
        <div style={{ padding: 24, backgroundColor: '#212427', height: '1000vh' }}>
            <Layout>
                <Header>
                    Tasks
                </Header>
                
            </Layout>
            <Tabs defaultActiveKey="1" onChange={callback} style={{ padding: '0 50px' }}>
                <TabPane tab="Footlocker" key="1">
                    <Store
                        
                    />
                </TabPane>
                
                
                <TabPane tab="Footlocker" key="2">
                    <Store
                        
                    />
                </TabPane>


                <TabPane tab="Nike" key="3">
                    <Store
                        
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default TaskPage;
