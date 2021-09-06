import React, { useEffect, useState } from 'react';
import { Status } from '../../interfaces/TaskInterfaces';
const { ipcRenderer } = window.require('electron');

const statusColor = (level: string) => {
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
            return '#f7331e';
        default:
            return 'white';
    }
};

const readStatus = (uuid: string): Status => {
    const status = localStorage.getItem(uuid) ?? JSON.stringify({ message: 'Idle', level: 'idle' });
    return JSON.parse(status);
};

const TaskStatus = (props: any) => {
    const { uuid }: { uuid: string } = props;

    const [status, setStatus] = useState<Status>(readStatus(uuid));

    useEffect(() => {
        ipcRenderer.on(uuid, (event, status: Status) => {
            setStatus(status);
        });

        return () => {
            ipcRenderer.removeAllListeners(uuid);
        };
    }, [uuid]);

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
