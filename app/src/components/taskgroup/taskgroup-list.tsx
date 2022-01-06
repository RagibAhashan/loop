import { TaskGroupChannel } from '@core/ipc-channels';
import { TaskGroupViewData } from '@core/taskgroup';
import React, { useEffect, useState } from 'react';
import TaskGroup from './taskgroup';

interface Props {
    taskGroups: TaskGroupViewData[];
}
const TaskGroupList: React.FunctionComponent<Props> = (props) => {
    const { taskGroups } = props;

    // Only used to style focus the selected task group
    const [selectedTaskGroup, setSelectedTaskGroup] = useState(null);

    useEffect(() => {
        window.ElectronBridge.on(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);

        return () => {
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.onTaskGroupSelected);
        };
    }, []);

    const handleOnTaskGroupSelected = (_, taskGroup: TaskGroupViewData) => {
        setSelectedTaskGroup(taskGroup);
    };

    return (
        <div>
            {taskGroups.map((taskGroup) => (
                <TaskGroup key={taskGroup.name} taskGroup={taskGroup} selected={selectedTaskGroup}></TaskGroup>
            ))}
        </div>
    );
};

export default TaskGroupList;
