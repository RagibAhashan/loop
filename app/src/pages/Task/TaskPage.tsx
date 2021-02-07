import { Button, Select, Tabs, Modal } from 'antd';
import React, { useState } from 'react';
import { NOTIFY_STOP_TASK, STORES } from '../../common/Constants';
import { TaskData } from '../../interfaces/TaskInterfaces';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Store from './Store';
const { TabPane } = Tabs;
const { Option } = Select;
const { ipcRenderer } = window.require('electron');

const ALL_STORES: any = STORES;
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
    const [store, setStore] = useState({} as any);

    const addStore = () => {
        if (!store) return;
        setStoreModalVisible(false);
        const addedPane: Pane = { title: store.name, key: store.key };
        setPanes((old) => {
            const newState = [...old, addedPane];
            localStorage.setItem('stores', JSON.stringify(newState));
            return newState;
        });
    };

    const onEdit = (targetKey: any, action: any) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure to delete this store? ',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => deleteStore(targetKey),
        });
    };

    const deleteStore = (key: string) => {
        const tasks = JSON.parse(localStorage.getItem(key) as string) as TaskData[];
        const stores = JSON.parse(localStorage.getItem('stores') as string) as Pane[];
        console.log('test', key, tasks, stores);

        if (tasks) {
            // cancel and delete all running tasks from store
            tasks.forEach((task) => {
                ipcRenderer.send(NOTIFY_STOP_TASK, task.uuid);
                localStorage.removeItem(task.uuid);
            });
        }

        if (stores) {
            console.log('delete that shit yo', key);

            localStorage.removeItem(key);

            setPanes((oldStores: Pane[]) => {
                const newStores = oldStores.filter((store) => store.key !== key);
                localStorage.setItem('stores', JSON.stringify(newStores));
                return newStores;
            });
        }
    };

    const openStoreModal = () => {
        setStoreModalVisible(true);
    };

    const onStoreSelect = (key: string) => {
        setStore(ALL_STORES[key]);
    };

    const isStoreCreated = (store: string): boolean => {
        return panes.find((s) => s.title === store) ? true : false;
    };

    const addMenu = (
        <Button type="primary" onClick={() => openStoreModal()}>
            Add Store
        </Button>
    );

    return (
        <div style={{ padding: 24, height: '100%' }}>
            <Tabs hideAdd style={{ height: '100%' }} defaultActiveKey="1" tabBarExtraContent={addMenu} type="editable-card" onEdit={onEdit}>
                {panes.map((pane) => (
                    <TabPane tab={<span>{pane.title}</span>} key={pane.key}>
                        <Store key={pane.key} storeName={pane.key} />
                    </TabPane>
                ))}
            </Tabs>

            <Modal title="Add Store" visible={isStoreModalVisible} onOk={addStore} onCancel={() => setStoreModalVisible(false)}>
                <Select value={undefined} placeholder="Select Store" onChange={onStoreSelect} style={{ width: 200, margin: 'auto' }}>
                    {Object.entries(STORES).map(([storeKey, store]) => (
                        <Option key={store.key} disabled={isStoreCreated(store.name)} value={storeKey}>
                            {store.name}
                        </Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default TaskPage;
