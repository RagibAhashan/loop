import { Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIFY_START_TASK } from '../../common/Constants';
import { StoreType } from '../../constants/Stores';
import { AppState } from '../../global-store/GlobalStore';
import { getStoreById, getTasksByStore, startAllTasks } from '../../services/Store/StoreService';
import { buttonStyle } from '../../styles/Buttons';
const { ipcRenderer } = window.require('electron');

const StartAllTasksAction = (props: any) => {
    const { storeKey }: { storeKey: StoreType; uuid: string } = props;

    const tasks = useSelector((state: AppState) => getTasksByStore(state, storeKey));
    const store = useSelector((state: AppState) => getStoreById(state, storeKey));
    const areTasksRunning = store.running;
    const areTasksCreated = Object.keys(tasks).length > 0;

    const dispatch = useDispatch();

    const handleStartAllTasks = () => {
        dispatch(startAllTasks({ storeKey }));
        Object.values(tasks).forEach((task) => {
            ipcRenderer.send(NOTIFY_START_TASK(storeKey), task.uuid, storeKey, task);
        });
    };

    return (
        <Button
            type="default"
            style={{ ...buttonStyle, backgroundColor: 'green' }}
            onClick={handleStartAllTasks}
            disabled={!areTasksCreated || areTasksRunning}
        >
            Run all
        </Button>
    );
};

export default StartAllTasksAction;
