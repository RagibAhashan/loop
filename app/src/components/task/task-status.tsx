import { taskStatusColor } from '@core/helpers';
import { TaskEmittedEvents, TaskStatus, TaskViewData } from '@core/task';
import React, { useEffect, useState } from 'react';

interface Props {
    task: TaskViewData;
}
const TaskStatus: React.FunctionComponent<Props> = (props) => {
    const { task } = props;

    const [status, setStatus] = useState<TaskStatus>(task.status);

    useEffect(() => {
        console.log('rendereing task status');
        window.ElectronBridge.on(TaskEmittedEvents.Status + task.id, handleTaskStatusUpdated);

        return () => {
            window.ElectronBridge.removeAllListeners(TaskEmittedEvents.Status + task.id);
        };
    }, [task.id]);

    const handleTaskStatusUpdated = (event, status: TaskStatus) => {
        setStatus(status);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg height="6" width="6">
                <circle cx="3" cy="3" r="3" fill={taskStatusColor(status.level)} />
            </svg>
            <span
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: taskStatusColor(status.level),
                    fontWeight: 500,
                    marginLeft: 5,
                    flex: 1,
                }}
            >
                {status.message}
            </span>
        </div>
    );
};

export default TaskStatus;
