import { AccountViewData } from '@core/account';
import { AccountGroupViewData } from '@core/account-group';
import React from 'react';

interface Props {
    account: AccountViewData;
    style: any;
    selectedAccountGroup: AccountGroupViewData;
}

const Account: React.FunctionComponent<Props> = (props) => {
    return <div>account component</div>;
};

export default Account;
