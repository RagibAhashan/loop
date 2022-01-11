import { QuestionCircleOutlined } from '@ant-design/icons';
import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/task-group';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    tasks: TaskViewData[];
    taskGroup: TaskGroupViewData | undefined;
}
// This component will contain the delete all task button
const DeleteAllTaskAction: React.FunctionComponent<Props> = (props) => {
    const { tasks, taskGroup } = props;

    const noTaskCreated = tasks.length === 0;

    const areTaskRunning = false;

    const handleDeleteAll = () => {
        if (!taskGroup) return;
        window.ElectronBridge.send(TaskGroupChannel.removeAllTasksFromGroup, taskGroup.id);
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
