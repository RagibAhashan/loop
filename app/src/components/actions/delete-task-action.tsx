import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/taskgroup';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { deleteButton } from '../../styles/Buttons';

interface Props {
    task: TaskViewData;
    taskGroup: TaskGroupViewData;
}
const DeleteTaskAction: React.FunctionComponent<Props> = (props) => {
    const { task, taskGroup } = props;

    const handleDelete = () => {
        window.ElectronBridge.send(TaskGroupChannel.removeTaskFromGroup, taskGroup.id, [task.id]);
    };

    return (
        <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={handleDelete}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
        >
            <Button style={deleteButton} icon={<DeleteFilled />} size="small" />
        </Popconfirm>
    );
};

export default DeleteTaskAction;
