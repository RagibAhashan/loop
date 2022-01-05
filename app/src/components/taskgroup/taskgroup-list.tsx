import { TaskGroupChannel } from '@core/IpcChannels';
import { TaskGroupViewData } from '@core/TaskGroup';
import React, { useEffect, useState } from 'react';
import TaskGroup from './taskgroup';

interface Props {
    taskGroups: TaskGroupViewData[];
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

    const handleOnTaskGroupSelected = (_, taskGroup: TaskGroupViewData) => {
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
