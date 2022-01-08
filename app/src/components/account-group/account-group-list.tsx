import { AccountGroupViewData } from '@core/account-group';
import { AccountGroupChannel } from '@core/ipc-channels';
import React, { useEffect, useState } from 'react';
import AccountGroup from './account-group';

interface Props {
    accountGroups: AccountGroupViewData[];
}

const AccountGroupList: React.FunctionComponent<Props> = (props) => {
    const { accountGroups } = props;
    const [selectedAccountGroup, setSelectedAccountGroup] = useState(null);

    useEffect(() => {
        window.ElectronBridge.on(AccountGroupChannel.onAccountGroupSelected, handleOnAccountGroupSelected);

        return () => {
            window.ElectronBridge.removeAllListeners(AccountGroupChannel.onAccountGroupSelected);
        };
    }, []);

    const handleOnAccountGroupSelected = (_, accountGroup: AccountGroupViewData) => {
        setSelectedAccountGroup(accountGroup);
    };

    return (
        <div>
            {accountGroups.map((accountGroup) => (
                <AccountGroup key={accountGroup.id} accountGroup={accountGroup} selectedAccountGroup={selectedAccountGroup}></AccountGroup>
            ))}
        </div>
    );
};

export default AccountGroupList;
