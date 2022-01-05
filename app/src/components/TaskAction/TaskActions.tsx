import { ProfileGroupViewData } from '@core/ProfileGroup';
import { ProxySetViewData } from '@core/ProxySet';
import { TaskViewData } from '@core/Task';
import React from 'react';
import DeleteTaskAction from './DeleteTaskAction';
import StartTaskAction from './StartTaskAction';
import StopTaskAction from './StopTaskAction';

interface Props {
    task: TaskViewData;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    groupName: string;
}

const TaskActions: React.FunctionComponent<Props> = (props) => {
    const { task, profileGroups, proxySets, groupName } = props;

    const isRunning = false;

    const runButton = () => {
        return task.isRunning ? (
            <StopTaskAction groupName={groupName} task={task}></StopTaskAction>
        ) : (
            <StartTaskAction groupName={groupName} task={task}></StartTaskAction>
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
                <DeleteTaskAction groupName={groupName} task={task}></DeleteTaskAction>
            </div>
        </div>
    );
};

export default TaskActions;
