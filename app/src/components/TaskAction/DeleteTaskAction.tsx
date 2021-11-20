import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { ITask } from '@core/Task';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { deleteButton } from '../../styles/Buttons';

interface Props {
    task: ITask;
}
const DeleteTaskAction: React.FunctionComponent<Props> = (props) => {
    const { task } = props;

    const handleDelete = () => {
        console.log('deleting task ', task);
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
