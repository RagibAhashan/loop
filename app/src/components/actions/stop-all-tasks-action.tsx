import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskGroupViewData } from '@core/taskgroup';
import { Button } from 'antd';
import React from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    taskGroup: TaskGroupViewData;
    areTasksRunning: boolean;
    areTasksCreated: boolean;
}
const StopAllTasksAction: React.FunctionComponent<Props> = (props) => {
    const { taskGroup, areTasksCreated, areTasksRunning } = props;

    const handleStopAllTasks = () => {
        window.ElectronBridge.send(TaskGroupChannel.stopAllTasks, taskGroup.id);
    };

    return (
        <Button style={buttonStyle} type="primary" onClick={handleStopAllTasks} danger disabled={!areTasksCreated || !areTasksRunning || !!taskGroup}>
            Stop all
        </Button>
    );
};

export default StopAllTasksAction;
