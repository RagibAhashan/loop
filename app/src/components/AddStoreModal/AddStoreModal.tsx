import { StoreInfo, STORES, StoreType } from '@constants/Stores';
import { Button, Form, Modal, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../global-store/GlobalStore';
import { addStore, isStoreCreated } from '../../services/Store/StoreService';
const { Option } = Select;

const AddStoreModal = () => {
    const [selectedStore, setSelectedStore] = useState<StoreInfo>();
    const [isAddStoreModalVisible, setIsAddStoreModalVisible] = useState(false);
    const [form] = useForm();

    const IsStoreAlreadyAdded = (storeKey: StoreType) => useSelector((state: AppState) => isStoreCreated(state, storeKey));

    const dispatch = useDispatch();

    const onStoreSelect = (key: StoreType) => {
        setSelectedStore(STORES[key]);
    };

    const openAddStoreModal = () => {
        // here I reset the select options, bug where you could add already added store.
        form.setFieldsValue({ selectStore: undefined });
        setIsAddStoreModalVisible(true);
    };

    const onClose = () => {
        setSelectedStore(undefined);
    };

    const onAddStore = () => {
        if (!selectedStore) return;

        setIsAddStoreModalVisible(false);
        dispatch(addStore({ storeKey: selectedStore.key, storeName: selectedStore.name }));
    };

    return (
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
            <Button type="primary" onClick={openAddStoreModal}>
                Add Store
            </Button>

            <Modal
                destroyOnClose={true} // <= not working ???
                afterClose={onClose}
                title="Add Store"
                visible={isAddStoreModalVisible}
                onOk={onAddStore}
                onCancel={() => setIsAddStoreModalVisible(false)}
                okButtonProps={{ disabled: !selectedStore }}
            >
                <Form form={form}>
                    <Form.Item name={'selectStore'}>
                        <Select placeholder="Select Store" onChange={onStoreSelect} style={{ width: 200, margin: 'auto' }}>
                            {Object.entries(STORES).map(([storeKey, store]) => (
                                <Option key={store.key} disabled={IsStoreAlreadyAdded(store.key)} value={storeKey}>
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

export default AddStoreModal;
