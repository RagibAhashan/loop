import { StopFilled } from '@ant-design/icons';
import { TaskGroupChannel } from '@core/IpcChannels';
import { ITask } from '@core/Task';
import { Button } from 'antd';
import React from 'react';
import { stopButton } from '../../styles/Buttons';

interface Props {
    task: ITask;
    groupName: string;
}

const StopTaskAction: React.FunctionComponent<Props> = (props) => {
    const { task, groupName } = props;

    const handleStopTask = () => {
        console.log('stopping task', task.taskData.uuid);
        window.ElectronBridge.send(TaskGroupChannel.stopTask, groupName, task.taskData.uuid);
    };

    return <Button onClick={handleStopTask} style={stopButton} icon={<StopFilled />} size="small" />;
};

export default StopTaskAction;
