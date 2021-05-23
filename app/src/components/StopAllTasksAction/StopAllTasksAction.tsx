import { Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIFY_STOP_TASK } from '../../common/Constants';
import { StoreType } from '../../constants/Stores';
import { AppState } from '../../global-store/GlobalStore';
import { getStoreById, getTasksByStore, stopAllTasks } from '../../services/Store/StoreService';
import { buttonStyle } from '../../styles/Buttons';
const { ipcRenderer } = window.require('electron');

const StopAllTasksAction = (props: any) => {
    const { storeKey }: { storeKey: StoreType; uuid: string } = props;

    const tasks = useSelector((state: AppState) => getTasksByStore(state, storeKey));
    const store = useSelector((state: AppState) => getStoreById(state, storeKey));
    const areTaskRunning = store.running;
    const areTaskCreated = Object.keys(tasks).length > 0;

    const dispatch = useDispatch();

    const handleStopAllTasks = () => {
        dispatch(stopAllTasks({ storeKey }));
        console.log('stopped action dispatch done');
        Object.values(tasks).forEach((task) => {
            ipcRenderer.send(NOTIFY_STOP_TASK(storeKey), task.uuid);
        });

        console.log('stopped action send notif done');
    };

    return (
        <Button style={buttonStyle} type="primary" onClick={handleStopAllTasks} danger disabled={!areTaskRunning || !areTaskCreated}>
            Stop all
        </Button>
    );
};

export default StopAllTasksAction;
