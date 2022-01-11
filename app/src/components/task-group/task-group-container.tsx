import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskGroupViewData } from '@core/task-group';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddTaskGroupModal from './add-task-group-modal';
import TaskGroupList from './task-group-list';

const TaskGroupContainer: React.FunctionComponent = () => {
    const [taskGroups, setTaskGroups] = useState<TaskGroupViewData[]>([]);

    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        window.ElectronBridge.invoke(TaskGroupChannel.getAllTaskGroups).then((data: TaskGroupViewData[]) => {
            setTaskGroups(data);
        });

        window.ElectronBridge.on(TaskGroupChannel.taskGroupUpdated, handleTaskGroupUpdated);
        window.ElectronBridge.on(TaskGroupChannel.taskGroupError, handleTaskGroupExists);

        return () => {
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.taskGroupUpdated);
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.taskGroupError);
        };
    }, []);

    const handleTaskGroupUpdated = (_, taskGroups: TaskGroupViewData[], msg) => {
        setTaskGroups(taskGroups);
        if (msg) message.success(msg, 2);
    };

    const handleTaskGroupExists = (_) => {
        message.error('Task Group Already Exists', 2);
    };

    const handleAddTaskGroup = () => {
        setOpen(true);
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
            <AddTaskGroupModal isOpen={isOpen} setOpen={setOpen}></AddTaskGroupModal>
        </div>
    );
};

export default TaskGroupContainer;
