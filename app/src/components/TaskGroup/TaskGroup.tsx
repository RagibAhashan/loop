import { CloseCircleOutlined } from '@ant-design/icons';
import { StoreType } from '@constants/Stores';
import { TaskGroupChannel } from '@core/IpcChannels';
import { Button } from 'antd';
import React from 'react';

interface Props {
    name: string;
    store: StoreType;
}

const TaskGroup: React.FunctionComponent<Props> = (props) => {
    const { name, store } = props;

    const handleClickTaskGroup = () => {
        window.ElectronBridge.send(TaskGroupChannel.getTaskGroupTasks, name);
    };
    const handleRemoveTaskGroupClick = (event) => {
        window.ElectronBridge.send(TaskGroupChannel.removeTaskGroup, name);
        event.stopPropagation();
    };

    return (
        <div style={{ width: '190px', height: '100px', backgroundColor: '#212427', padding: 10, margin: 10 }} onClick={handleClickTaskGroup}>
            <div>
                <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={handleRemoveTaskGroupClick} />
            </div>
            <div>Group {name}</div>
            <div>Store {store}</div>
        </div>
    );
};

export default TaskGroup;
