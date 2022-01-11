import { ProfileGroupViewData } from '@core/profile-group';
import { ProxyGroupViewData } from '@core/proxy-group';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/task-group';
import React from 'react';
import DeleteTaskAction from './delete-task-action';
import StartTaskAction from './start-task-action';
import StopTaskAction from './stop-task-action';

interface Props {
    task: TaskViewData;
    proxyGroups: ProxyGroupViewData[];
    profileGroups: ProfileGroupViewData[];
    taskGroup: TaskGroupViewData;
}

const TaskActions: React.FunctionComponent<Props> = (props) => {
    const { task, profileGroups, proxyGroups, taskGroup } = props;

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
                    proxyGroups={proxyGroups}
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
