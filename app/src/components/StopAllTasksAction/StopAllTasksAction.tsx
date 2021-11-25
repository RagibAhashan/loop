import { TaskGroupChannel } from '@core/IpcChannels';
import { Button } from 'antd';
import React from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    groupName: string;
    areTasksRunning: boolean;
    areTasksCreated: boolean;
}
const StopAllTasksAction: React.FunctionComponent<Props> = (props) => {
    const { groupName, areTasksCreated, areTasksRunning } = props;

    const handleStopAllTasks = () => {
        window.ElectronBridge.send(TaskGroupChannel.stopAllTasks, groupName);
    };

    return (
        <Button style={buttonStyle} type="primary" onClick={handleStopAllTasks} danger disabled={!areTasksCreated || !areTasksRunning}>
            Stop all
        </Button>
    );
};

export default StopAllTasksAction;
