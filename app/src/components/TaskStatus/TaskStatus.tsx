import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StoreType } from '../../constants/Stores';
import { Status, StatusLevel } from '../../interfaces/TaskInterfaces';
import { stopTask } from '../../services/Store/StoreService';

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

const readStatus = (uuid: string): Status => {
    const status = localStorage.getItem(uuid) ?? JSON.stringify({ message: 'Idle', level: 'idle' });

    return JSON.parse(status);
};

const TaskStatus = (props: any) => {
    const { uuid, storeKey }: { uuid: string; storeKey: StoreType } = props;

    const [status, setStatus] = useState<Status>(readStatus(uuid));

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Task status init');
        window.ElectronBridge.on(uuid, (event, status: Status) => {
            setStatus(status);

            if (status.level === 'fail') {
                dispatch(stopTask({ storeKey: storeKey, uuid: uuid }));
            }
        });

        return () => {
            console.log('task status destroy');
            window.ElectronBridge.removeAllListeners(uuid);
        };
    }, []);

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
