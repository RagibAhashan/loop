import { StopFilled } from '@ant-design/icons';
import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/task-group';
import { Button } from 'antd';
import React from 'react';
import { stopButton } from '../../styles/Buttons';

interface Props {
    task: TaskViewData;
    taskGroup: TaskGroupViewData;
}

const StopTaskAction: React.FunctionComponent<Props> = (props) => {
    const { task, taskGroup } = props;

    const handleStopTask = () => {
        console.log('stopping task', task.id);
        window.ElectronBridge.send(TaskGroupChannel.stopTask, taskGroup.id, task.id);
    };

    return <Button onClick={handleStopTask} style={stopButton} icon={<StopFilled />} size="small" />;
};

export default StopTaskAction;
