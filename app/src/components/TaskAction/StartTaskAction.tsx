import { PlayCircleFilled } from '@ant-design/icons';
import { ITask } from '@core/Task';
import { Button } from 'antd';
import React from 'react';
import { startButton } from '../../styles/Buttons';

interface Props {
    task: ITask;
}
const StartTaskAction: React.FunctionComponent<Props> = (props) => {
    const { task } = props;

    const handleStartTask = () => {
        console.log('starting task', task);
    };

    return <Button onClick={handleStartTask} style={startButton} icon={<PlayCircleFilled />} size="small" />;
};

export default StartTaskAction;
