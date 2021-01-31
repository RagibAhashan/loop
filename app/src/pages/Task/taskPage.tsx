import { CloseOutlined } from '@ant-design/icons';
import { Button, Layout, Select, Tabs } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { STORES } from '../../constants';
import Store from './Store';
const { TabPane } = Tabs;
const { Header } = Layout;
const { Option } = Select;

const text = 'Are you sure to delete this store?\nAll running tasks will be terminated.';

interface Pane {
    title: string;
    key: string;
}

const getStores = (): Pane[] => {
    const stores = JSON.parse(localStorage.getItem('stores') as string) as Pane[];
    return stores ? stores : [];
};

const TaskPage = () => {
    const [panes, setPanes] = useState(() => getStores());
    const [isStoreModalVisible, setStoreModalVisible] = useState(false);
    const [storeName, setStoreName] = useState('');

    const addStore = () => {
        if (!storeName) return;
        setStoreModalVisible(false);
        const addedPane: Pane = { title: storeName, key: storeName };
        setPanes((old) => {
            const newState = [...old, addedPane];
            localStorage.setItem('stores', JSON.stringify(newState));
            return newState;
        });
    };

    const openStoreModal = () => {
        setStoreModalVisible(true);
    };

    const onStoreSelect = (name: string) => {
        setStoreName((prevName) => (prevName = name));
    };

    const isStoreCreated = (store: string): boolean => {
        return panes.find((s) => s.title === store) ? true : false;
    };

    const addMenu = <Button onClick={() => openStoreModal()}> Add Store </Button>;

    return (
        <div style={{ padding: 24, backgroundColor: '#212427', height: '100vh' }}>
            <Layout>
                <Header>
                    <p style={{ fontSize: 30 }}>Tasks</p>
                </Header>
            </Layout>
            <Tabs style={{ marginTop: 10 }} defaultActiveKey="1" tabBarExtraContent={addMenu}>
                {panes.map((pane) => (
                    <TabPane
                        tab={
                            <span>
                                <Button size="small" shape="circle" type="text" icon={<CloseOutlined />} />
                                {pane.title}
                            </span>
                        }
                        key={pane.key}
                    >
                        <Store storeName={pane.title} />
                    </TabPane>
                ))}
            </Tabs>

            <Modal title="Add Store" visible={isStoreModalVisible} onOk={addStore} onCancel={() => setStoreModalVisible(false)}>
                <Select placeholder="Select Store" onChange={onStoreSelect} style={{ width: 200, margin: 'auto' }}>
                    {STORES.map((store) => (
                        <Option disabled={isStoreCreated(store)} value={store}>
                            {store}
                        </Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default TaskPage;
