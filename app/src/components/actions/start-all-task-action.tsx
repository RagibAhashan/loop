import { TaskGroupChannel } from '@core/ipc-channels';
import { Button } from 'antd';
import React from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    groupName: string;
    areTasksRunning: boolean;
    areTasksCreated: boolean;
}
const StartAllTasksAction: React.FunctionComponent<Props> = (props) => {
    const { groupName, areTasksCreated, areTasksRunning } = props;

    const handleStartAllTasks = () => {
        window.ElectronBridge.send(TaskGroupChannel.startAllTasks, groupName);
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
