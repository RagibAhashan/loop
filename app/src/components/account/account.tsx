import { AccountGroupViewData } from '@core/account-group';
import { AccountViewData } from '@core/models/account';
import React from 'react';
import AccountActions from './account-actions';
import AccountStatus from './account-status';

interface Props {
    account: AccountViewData;
    style: any;
    selectedAccountGroup: AccountGroupViewData;
}

const Account: React.FunctionComponent<Props> = (props) => {
    const { account, style, selectedAccountGroup } = props;

    return (
        <div style={style}>
            <div className="task-row" style={{ height: style.height - 5 }}>
                <div>{account.name}</div>

                <div>{account.email}</div>
                <div>*********</div>
                <div>
                    <AccountStatus account={account}></AccountStatus>
                </div>
                <div>
                    <AccountActions account={account}></AccountActions>
                </div>
            </div>
        </div>
    );
};

export default Account;
