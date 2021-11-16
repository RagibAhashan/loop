import { Button } from 'antd';
import React from 'react';
import { buttonStyle } from '../../styles/Buttons';

const StopAllTasksAction = (props: any) => {
    // const { storeKey }: { storeKey: StoreType; uuid: string } = props;

    // const tasks = useSelector((state: AppState) => getTasksByStore(state, storeKey));
    // const store = useSelector((state: AppState) => getStoreById(state, storeKey));
    // const areTaskRunning = store.running;
    // const areTaskCreated = Object.keys(tasks).length > 0;

    // const dispatch = useDispatch();

    const handleStopAllTasks = () => {
        // dispatch(stopAllTasks({ storeKey }));
        // Object.values(tasks).forEach((task) => {
        //     window.ElectronBridge.send(NOTIFY_STOP_TASK(storeKey), task.uuid);
        // });
    };

    return (
        <Button style={buttonStyle} type="primary" onClick={handleStopAllTasks} danger>
            Stop all
        </Button>
    );
};

export default StopAllTasksAction;
