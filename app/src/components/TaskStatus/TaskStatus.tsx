import React, { useEffect } from 'react';
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
    status: Status;
}
const TaskStatus: React.FunctionComponent<Props> = (props) => {
    const { status } = props;

    console.log('task status', status);
    useEffect(() => {
        // console.log('Task status init');
        // window.ElectronBridge.on(uuid, (event, status: Status) => {
        //     setStatus(status);
        //     if (status.level === 'fail') {
        //         dispatch(stopTask({ storeKey: storeKey, uuid: uuid }));
        //     }
        // });
        // return () => {
        //     console.log('task status destroy');
        //     window.ElectronBridge.removeAllListeners(uuid);
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
