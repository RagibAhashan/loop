import { QuestionCircleOutlined } from '@ant-design/icons';
import { StoreType } from '@constants/Stores';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIFY_STOP_TASK } from '../../common/Constants';
import { AppState } from '../../global-store/GlobalStore';
import { deleteAllTasks, getStoreById, getTasksByStore } from '../../services/Store/StoreService';
import { buttonStyle } from '../../styles/Buttons';

// This component will contain the delete all task button
const DeleteAllTaskAction = (props: any) => {
    const { storeKey }: { storeKey: StoreType } = props;

    const tasks = useSelector((state: AppState) => getTasksByStore(state, storeKey));
    const noTaskCreated = Object.keys(tasks).length === 0;

    const currentStore = useSelector((state: AppState) => getStoreById(state, storeKey));
    const areTaskRunning = currentStore.running;

    const dispatch = useDispatch();

    const handleDeleteAll = () => {
        dispatch(deleteAllTasks({ storeKey: storeKey }));

        // also stop all tasks in case, logic is here and not in dispatch to not
        Object.values(tasks).forEach((task) => {
            window.ElectronBridge.send(NOTIFY_STOP_TASK(storeKey), task.uuid);
            localStorage.removeItem(task.uuid);
            // if (task.proxySet && task.proxy) dispatch(unassignProxy({ name: task.proxySet, proxy: task.proxy, taskID: task.uuid }));
        });
    };

    return (
        <div>
            <Popconfirm
                title="Are you sure?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={handleDeleteAll}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                disabled={noTaskCreated || areTaskRunning}
            >
                <Button style={buttonStyle} type="primary" danger disabled={noTaskCreated || areTaskRunning}>
                    Delete All
                </Button>
            </Popconfirm>
        </div>
    );
};

export default DeleteAllTaskAction;
