import { Button, Col, Layout, message, Popconfirm, Row, Tabs, Table, Space, Tag } from 'antd';
import React from 'react';
import TaskComponent from './task';
import TaskSideBar from './TaskSideBar';

const text = 'Are you sure to delete this store?\nAll running tasks will be terminated.';


/*
const TaskPage = () => {
    const { Sider, Content } = Layout;

    function confirm() {
        message.success('Store deleted!');
    }

    return (
        <div>
            <Layout>
                <Sider style={{ backgroundColor: '#282C31' }}>
                    <TaskSideBar />
                </Sider>
                <Content style={{ marginLeft: '50px', marginRight: '50px' }}>
                    <Row style={{ marginTop: '15px', marginBottom: '-20px' }}>
                        <Col span={8}>
                            <p style={{ fontSize: '35px', color: 'orange' }}>Footlocker Tasks</p>
                        </Col>
                        <Col span={8} offset={8}>
                            <div style={{ marginLeft: '185px' }}>
                                <Popconfirm placement="bottom" title={text} onConfirm={confirm} okText="Yes" cancelText="No">
                                    <Button
                                        type="primary"
                                        danger
                                        style={{
                                            marginTop: '10px',
                                            height: '39px',
                                        }}
                                    >
                                        Delete Store
                                    </Button>
                                </Popconfirm>
                            </div>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '0px', height: '100%' }}>
                        <Col span={24}>
                            <TaskComponent />
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </div>
    );
};
*/

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


    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];

    const onChange = () => {};

    const { Sider, Content, Header } = Layout;

    return (
        <div>
            <Layout>
                <Header>
                    Tasks
                </Header>
                
            </Layout>
            <Tabs defaultActiveKey="1" onChange={callback} style={{ padding: '0 50px' }}>
                <TabPane tab="All Tasks" key="1">
                    <TaskComponent />
                </TabPane>
                
                
                <TabPane tab="Footlocker" key="2">
                    <Table
                        columns={columns}
                        dataSource={data}
                        onChange={onChange} 
                    />
                </TabPane>


                <TabPane tab="Nike" key="3">
                    <Table
                        columns={columns}
                        dataSource={data}
                        onChange={onChange} 
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default TaskPage;
