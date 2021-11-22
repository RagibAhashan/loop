import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { TaskGroupChannel } from '@core/IpcChannels';
import { ITask } from '@core/Task';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { deleteButton } from '../../styles/Buttons';

interface Props {
    task: ITask;
    groupName: string;
}
const DeleteTaskAction: React.FunctionComponent<Props> = (props) => {
    const { task, groupName } = props;

    const handleDelete = () => {
        window.ElectronBridge.send(TaskGroupChannel.removeTaskFromGroup, groupName, [task.taskData.uuid]);
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
