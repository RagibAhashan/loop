import WalmartEditTaskModal from '@components/Walmart/WalmartEditTaskModal';
import { ITask } from '@core/Task';
import React from 'react';
import DeleteTaskAction from './DeleteTaskAction';
import EditTaskAction from './EditTaskAction';
import StartTaskAction from './StartTaskAction';
import StopTaskAction from './StopTaskAction';

interface Props {
    task: ITask;
}

const TaskActions: React.FunctionComponent<Props> = (props) => {
    const { task } = props;

    const isRunning = false;

    const runButton = () => {
        return isRunning ? <StopTaskAction task={task}></StopTaskAction> : <StartTaskAction task={task}></StartTaskAction>;
    };

    return (
        <div style={{ display: 'flex' }}>
            <div>{runButton()}</div>
            <div>
                <EditTaskAction task={task} EditTaskModalComponent={WalmartEditTaskModal}></EditTaskAction>
            </div>
            <div>
                <DeleteTaskAction task={task}></DeleteTaskAction>
            </div>
        </div>
    );
};

export default TaskActions;
