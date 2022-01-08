import { CloseCircleOutlined } from '@ant-design/icons';
import Editable from '@components/base/editable';
import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskGroupViewData } from '@core/taskgroup';
import { Button } from 'antd';
import React from 'react';

interface Props {
    taskGroup: TaskGroupViewData;
    selected: TaskGroupViewData;
}

const TaskGroup: React.FunctionComponent<Props> = (props) => {
    const { taskGroup, selected } = props;

    const isSelected = selected ? taskGroup.id === selected.id : false;

    const handleClickTaskGroup = () => {
        window.ElectronBridge.send(TaskGroupChannel.getAllTasksFromTaskGroup, taskGroup.id);
    };

    const handleRemoveTaskGroupClick = (event) => {
        window.ElectronBridge.send(TaskGroupChannel.removeTaskGroup, taskGroup.id);
        event.stopPropagation();
    };

    const handleNameEdit = (value: string) => {
        window.ElectronBridge.send(TaskGroupChannel.editTaskGroupName, taskGroup.id, value);
    };

    return (
        <div
            style={{
                width: '190px',
                height: '100px',
                backgroundColor: '#212427',
                padding: 10,
                margin: 10,
                borderRadius: 5,
                border: isSelected ? '1px solid rgb(177 142 15 / 92%)' : undefined,
            }}
            onClick={handleClickTaskGroup}
        >
            <div>
                <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={handleRemoveTaskGroupClick} />
            </div>
            <div>
                <Editable value={taskGroup.name} onSubmit={handleNameEdit} />
            </div>
            <div>Store {taskGroup.storeType}</div>
        </div>
    );
};

export default TaskGroup;
