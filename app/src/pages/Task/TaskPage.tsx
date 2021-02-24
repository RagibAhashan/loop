import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Tabs } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { NOTIFY_STOP_TASK, STORES } from '../../common/Constants';
import { IStore } from '../../interfaces/OtherInterfaces';
import { TaskData } from '../../interfaces/TaskInterfaces';
import Store from './Store';
const { TabPane } = Tabs;
const { Option } = Select;
const { ipcRenderer } = window.require('electron');

const ALL_STORES: any = STORES;

const getStores = (): IStore[] => {
    const stores = JSON.parse(localStorage.getItem('stores') as string) as IStore[];
    return stores ? stores : [];
};

const TaskPage = () => {
    const [panes, setPanes] = useState(() => getStores());
    const [isStoreModalVisible, setStoreModalVisible] = useState(false);
    const [store, setStore] = useState({} as any);
    const [form] = useForm();

    const addStore = () => {
        if (!store) return;

        setStoreModalVisible(false);
        const addedPane: IStore = { title: store.name, key: store.key };
        const newState = [...panes, addedPane];
        localStorage.setItem('stores', JSON.stringify(newState));
        setPanes(newState);
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
        const stores = JSON.parse(localStorage.getItem('stores') as string) as IStore[];

        if (tasks) {
            // cancel and delete all running tasks from store
            tasks.forEach((task) => {
                ipcRenderer.send(NOTIFY_STOP_TASK, task.uuid);
                localStorage.removeItem(task.uuid);
            });
        }

        if (stores) {
            localStorage.removeItem(key);

            const newStores = panes.filter((store) => store.key !== key);
            localStorage.setItem('stores', JSON.stringify(newStores));

            setPanes(newStores);
        }
    };

    const openStoreModal = () => {
        form.setFieldsValue({ selectStore: undefined });
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
                <Form form={form}>
                    <Form.Item name={'selectStore'}>
                        <Select placeholder="Select Store" onChange={onStoreSelect} style={{ width: 200, margin: 'auto' }}>
                            {Object.entries(STORES).map(([storeKey, store]) => (
                                <Option key={store.key} disabled={isStoreCreated(store.name)} value={storeKey}>
                                    {store.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TaskPage;
