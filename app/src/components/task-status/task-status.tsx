import { TaskChannel, TaskGroupChannel } from '@core/ipc-channels';
import { TaskViewData } from '@core/task';
import React, { useEffect, useState } from 'react';
import { Status, StatusLevel } from '../../interfaces/TaskInterfaces';

const statusColor = (level: StatusLevel) => {
    switch (level) {
        case 'idle':
            return '#faa61a';
        case 'info':
            return 'white';
        case 'success':
            return 'green';
        case 'error':
            return '#ff001e';
        case 'cancel':
        case 'fail':
            return '#f7331e';
        default:
            return 'white';
    }
};

interface Props {
    task: TaskViewData;
    groupName: string;
}
const TaskStatus: React.FunctionComponent<Props> = (props) => {
    const { task, groupName } = props;

    const [status, setStatus] = useState<Status>(task.status);

    useEffect(() => {
        window.ElectronBridge.on(TaskChannel.onTaskStatus + task.uuid, handleTaskStatusUpdated);
        window.ElectronBridge.invoke(TaskGroupChannel.getTaskFromTaskGroup, groupName, task.uuid).then((data: TaskViewData) => {
            setStatus(data.status);
        });

        return () => {
            window.ElectronBridge.removeAllListeners(TaskChannel.onTaskStatus + task.uuid);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTaskStatusUpdated = (event, status: Status) => {
        setStatus(status);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg height="6" width="6">
                <circle cx="3" cy="3" r="3" fill={statusColor(status.level)} />
            </svg>
            <span
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: statusColor(status.level),
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
