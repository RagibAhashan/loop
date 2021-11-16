import { ITaskGroup } from '@core/TaskGroup';
import React from 'react';
import TaskGroup from './TaskGroup';

interface Props {
    taskGroups: ITaskGroup[];
}
const TaskGroupList: React.FunctionComponent<Props> = (props) => {
    const { taskGroups } = props;

    return (
        <div>
            {taskGroups.map((taskGroup) => (
                <TaskGroup key={taskGroup.name} name={taskGroup.name} store={taskGroup.storeType}></TaskGroup>
            ))}
        </div>
    );
};

export default TaskGroupList;
