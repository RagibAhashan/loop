import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/taskgroup';
import React from 'react';
import DeleteTaskAction from './delete-task-action';
import StartTaskAction from './start-task-action';
import StopTaskAction from './stop-task-action';

interface Props {
    task: TaskViewData;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    taskGroup: TaskGroupViewData;
}

const TaskActions: React.FunctionComponent<Props> = (props) => {
    const { task, profileGroups, proxySets, taskGroup } = props;

    const isRunning = false;

    const runButton = () => {
        return task.isRunning ? (
            <StopTaskAction taskGroup={taskGroup} task={task}></StopTaskAction>
        ) : (
            <StartTaskAction taskGroup={taskGroup} task={task}></StartTaskAction>
        );
    };

    return (
        <div style={{ display: 'flex' }}>
            <div>{runButton()}</div>
            <div>
                {/* <EditTaskAction
                    EditTaskModalComponent={WalmartEditTaskModal}
                    profileGroups={profileGroups}
                    proxySets={proxySets}
                    task={task}
                ></EditTaskAction> */}
            </div>
            <div>
                <DeleteTaskAction taskGroup={taskGroup} task={task}></DeleteTaskAction>
            </div>
        </div>
    );
};

export default TaskActions;
