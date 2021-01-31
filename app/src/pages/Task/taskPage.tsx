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
        const newPane: Pane = { title: storeName, key: storeName };
        panes.push(newPane); // for some reason this is updating the state idk why wtf
        // setPanes((old) => [...old, ...panes]); // and this is not working wtffffffffffffffffff
        localStorage.setItem('stores', JSON.stringify(panes));
    };

    const openStoreModal = () => {
        setStoreModalVisible(true);
    };

    const onStoreSelect = (name: string) => {
        setStoreName((prevName) => (prevName = name));
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
                    <TabPane tab={pane.title} key={pane.key}>
                        <Store storeName={pane.title} />
                    </TabPane>
                ))}
            </Tabs>

            <Modal title="Add Store" visible={isStoreModalVisible} onOk={addStore} onCancel={() => setStoreModalVisible(false)}>
                <Select placeholder="Select Store" onChange={onStoreSelect} style={{ width: 200, margin: 'auto' }}>
                    {STORES.map((store) => (
                        <Option value={store}> {store} </Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default TaskPage;
