import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { StoreType } from '@constants/Stores';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../global-store/GlobalStore';
import { unassignProxy } from '../../services/Proxy/ProxyService';
import { deleteTask, getTaskById } from '../../services/Store/StoreService';
import { deleteButton } from '../../styles/Buttons';

const DeleteTaskAction = (props: any) => {
    const { storeKey, uuid }: { storeKey: StoreType; uuid: string } = props;

    const dispatch = useDispatch();

    const task = useSelector((state: AppState) => getTaskById(state, storeKey, uuid));

    const handleDelete = () => {
        dispatch(deleteTask({ storeKey: storeKey, uuid: uuid }));
        if (task.proxySet && task.proxy) dispatch(unassignProxy({ name: task.proxySet, proxy: task.proxy, taskID: task.uuid }));
    };

    return (
        <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={handleDelete}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
        >
            <Button style={deleteButton} icon={<DeleteFilled />} size="small" />
        </Popconfirm>
    );
};

export default DeleteTaskAction;
