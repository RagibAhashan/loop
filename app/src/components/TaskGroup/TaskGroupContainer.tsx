import { TaskGroupChannel } from '@core/IpcChannels';
import { ITaskGroup } from '@core/TaskGroup';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddTaskGroupModal from './AddTaskGroupModal';
import TaskGroupList from './TaskGroupList';

const TaskGroupContainer: React.FunctionComponent = () => {
    const [taskGroups, setTaskGroups] = useState<ITaskGroup[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        console.log('task group container init');
        window.ElectronBridge.invoke(TaskGroupChannel.getAllTaskGroups).then((data: ITaskGroup[]) => {
            setTaskGroups(data);
        });

        window.ElectronBridge.on(TaskGroupChannel.taskGroupUpdated, handleTaskGroupUpdated);
        window.ElectronBridge.on(TaskGroupChannel.taskGroupError, handleTaskGroupExists);

        return () => {
            console.log('destryoing');
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.taskGroupUpdated);
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.taskGroupError);
        };
    }, []);

    const handleTaskGroupUpdated = (_, taskGroups: ITaskGroup[]) => {
        setTaskGroups(taskGroups);
        message.success('Task Group Created');
    };

    const handleTaskGroupExists = (_) => {
        message.error('Task Group Already Exists');
    };

    const handleAddTaskGroup = () => {
        setShowModal(true);
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
            <Button style={{ marginBottom: 10 }} onClick={handleAddTaskGroup}>
                Add Task Group
            </Button>

            <TaskGroupList taskGroups={taskGroups}> </TaskGroupList>
            <AddTaskGroupModal showModal={showModal} setShowModal={setShowModal}></AddTaskGroupModal>
        </div>
    );
};

export default TaskGroupContainer;