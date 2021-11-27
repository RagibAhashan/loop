import { TaskGroupChannel } from '@core/IpcChannels';
import { ITaskGroup } from '@core/TaskGroup';
import React, { useEffect, useState } from 'react';
import TaskGroup from './TaskGroup';

interface Props {
    taskGroups: ITaskGroup[];
}
const TaskGroupList: React.FunctionComponent<Props> = (props) => {
    const { taskGroups } = props;

    // Only used to style focus the selected task group
    const [currentSelectedTaskGroup, setCurrentSelectedTaskGroup] = useState(null);

    useEffect(() => {
        window.ElectronBridge.on(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);

        return () => {
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.onTaskGroupSelected);
        };
    }, []);

    const handleOnTaskGroupSelected = (_, taskGroup: ITaskGroup) => {
        setCurrentSelectedTaskGroup(taskGroup.name);
    };

    return (
        <div>
            {taskGroups.map((taskGroup) => (
                <TaskGroup key={taskGroup.name} name={taskGroup.name} store={taskGroup.storeType} selected={currentSelectedTaskGroup}></TaskGroup>
            ))}
        </div>
    );
};

export default TaskGroupList;
