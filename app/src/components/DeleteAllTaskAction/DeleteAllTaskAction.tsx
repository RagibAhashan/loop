import { QuestionCircleOutlined } from '@ant-design/icons';
import { TaskGroupChannel } from '@core/IpcChannels';
import { ITask } from '@core/Task';
import { ITaskGroup } from '@core/TaskGroup';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    tasks: ITask[];
    taskGroup: ITaskGroup;
}
// This component will contain the delete all task button
const DeleteAllTaskAction: React.FunctionComponent<Props> = (props) => {
    const { tasks, taskGroup } = props;

    const noTaskCreated = tasks.length === 0;

    const areTaskRunning = false;

    const handleDeleteAll = () => {
        window.ElectronBridge.send(TaskGroupChannel.removeAllTasksFromGroup, taskGroup.name);
    };

    return (
        <div>
            <Popconfirm
                title="Are you sure?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={handleDeleteAll}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                disabled={noTaskCreated || areTaskRunning}
            >
                <Button style={buttonStyle} type="primary" danger disabled={noTaskCreated || areTaskRunning}>
                    Delete All
                </Button>
            </Popconfirm>
        </div>
    );
};

export default DeleteAllTaskAction;
