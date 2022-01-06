import { PlayCircleFilled } from '@ant-design/icons';
import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskViewData } from '@core/task';
import { Button } from 'antd';
import React from 'react';
import { startButton } from '../../styles/Buttons';

interface Props {
    task: TaskViewData;
    groupName: string;
}
const StartTaskAction: React.FunctionComponent<Props> = (props) => {
    const { task, groupName } = props;

    const handleStartTask = () => {
        console.log('starting task', task);
        window.ElectronBridge.send(TaskGroupChannel.startTask, groupName, task.uuid);
    };

    return <Button onClick={handleStartTask} style={startButton} icon={<PlayCircleFilled />} size="small" />;
};

export default StartTaskAction;
