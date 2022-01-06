import { StopFilled } from '@ant-design/icons';
import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskViewData } from '@core/task';
import { Button } from 'antd';
import React from 'react';
import { stopButton } from '../../styles/Buttons';

interface Props {
    task: TaskViewData;
    groupName: string;
}

const StopTaskAction: React.FunctionComponent<Props> = (props) => {
    const { task, groupName } = props;

    const handleStopTask = () => {
        console.log('stopping task', task.uuid);
        window.ElectronBridge.send(TaskGroupChannel.stopTask, groupName, task.uuid);
    };

    return <Button onClick={handleStopTask} style={stopButton} icon={<StopFilled />} size="small" />;
};

export default StopTaskAction;
