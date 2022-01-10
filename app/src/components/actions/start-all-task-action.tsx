import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskGroupViewData } from '@core/taskgroup';
import { Button } from 'antd';
import React from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    taskGroup: TaskGroupViewData | undefined;
    areTasksRunning: boolean;
    areTasksCreated: boolean;
}
const StartAllTasksAction: React.FunctionComponent<Props> = (props) => {
    const { taskGroup, areTasksCreated, areTasksRunning } = props;

    const handleStartAllTasks = () => {
        if (!taskGroup) return;

        window.ElectronBridge.send(TaskGroupChannel.startAllTasks, taskGroup.id);
    };

    return (
        <Button
            type="default"
            style={{ ...buttonStyle, backgroundColor: 'green' }}
            onClick={handleStartAllTasks}
            disabled={!areTasksCreated || areTasksRunning || !!taskGroup}
        >
            Run all
        </Button>
    );
};

export default StartAllTasksAction;
