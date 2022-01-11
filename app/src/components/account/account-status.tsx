import { accountStatusColor } from '@core/helpers';
import { AccountStatus, AccountViewData } from '@core/models/account';
import { TaskEmittedEvents } from '@core/task';
import React, { useEffect, useState } from 'react';

interface Props {
    account: AccountViewData;
}
const AccountStatus: React.FunctionComponent<Props> = (props) => {
    const { account } = props;

    const [status, setStatus] = useState<AccountStatus>(account.status);

    useEffect(() => {
        console.log('rendereing task status');
        window.ElectronBridge.on(TaskEmittedEvents.Status + account.id, handleTaskStatusUpdated);

        return () => {
            window.ElectronBridge.removeAllListeners(TaskEmittedEvents.Status + account.id);
        };
    }, [account.id]);

    const handleTaskStatusUpdated = (event, status: AccountStatus) => {
        setStatus(status);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg height="6" width="6">
                <circle cx="3" cy="3" r="3" fill={accountStatusColor(status.level)} />
            </svg>
            <span
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: accountStatusColor(status.level),
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

export default AccountStatus;
