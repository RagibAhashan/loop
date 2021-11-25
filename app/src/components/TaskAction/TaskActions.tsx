import WalmartEditTaskModal from '@components/Walmart/WalmartEditTaskModal';
import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { ITask } from '@core/Task';
import React, { useEffect } from 'react';
import DeleteTaskAction from './DeleteTaskAction';
import EditTaskAction from './EditTaskAction';
import StartTaskAction from './StartTaskAction';
import StopTaskAction from './StopTaskAction';

interface Props {
    task: ITask;
    proxySets: IProxySet[];
    profiles: IProfile[];
    groupName: string;
}

const TaskActions: React.FunctionComponent<Props> = (props) => {
    const { task, profiles, proxySets, groupName } = props;

    useEffect(() => {
        console.log('task action refreshed', task.isRunning);
    }, []);

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
                <EditTaskAction EditTaskModalComponent={WalmartEditTaskModal} profiles={profiles} proxySets={proxySets} task={task}></EditTaskAction>
            </div>
            <div>
                <DeleteTaskAction groupName={groupName} task={task}></DeleteTaskAction>
            </div>
        </div>
    );
};

export default TaskActions;
