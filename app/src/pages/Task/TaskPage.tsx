import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Tabs } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddStoreModal from '../../components/AddStoreModal/AddStoreModal';
import FootlockerStore from '../../components/Footlocker/FootlockerStore';
import WalmartStore from '../../components/Walmart/WalmartStore';
import { StoreType } from '../../constants/Stores';
import { deleteStore, getStores } from '../../services/Store/StoreService';
const { TabPane } = Tabs;

const RenderStore = (storeKey: StoreType) => {
    switch (storeKey) {
        case StoreType.FootlockerCA:
        case StoreType.FootlockerUS:
            return <FootlockerStore key={storeKey} storeKey={storeKey} />;
        case StoreType.WalmartCA:
        case StoreType.WalmartUS:
            return <WalmartStore key={storeKey} storeKey={storeKey} />;
    }
};
const TaskPage = () => {
    const dispatch = useDispatch();
    const currentStores = useSelector(getStores);

    const onEdit = (targetKey: any, action: any) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure to delete this store? ',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => onDeleteStore(targetKey),
        });
    };

    const onDeleteStore = (key: StoreType) => {
        dispatch(deleteStore({ storeKey: key }));
    };

    return (
        <div style={{ padding: 24, height: '100%', width: '100%' }}>
            <AddStoreModal />
            <Tabs hideAdd style={{ height: '100%' }} defaultActiveKey="1" type="editable-card" onEdit={onEdit}>
                {/* <div>test </div> */}
                {Object.entries(currentStores).map(([storeKey, store]) => (
                    <TabPane tab={<span>{store.displayName}</span>} key={storeKey}>
                        {RenderStore(storeKey as StoreType)}
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default TaskPage;
