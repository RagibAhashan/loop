import { AccountGroupViewData } from '@core/account-group';
import { AccountGroupChannel } from '@core/ipc-channels';
import { AccountViewData } from '@core/models/account';
import { Button, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import AccountHeaders from './account-headers';
import AccountList from './account-list';
import AddAccountModal from './add-account-modal';

const { Title } = Typography;

export interface State {
    accounts: AccountViewData[];
    selectedAccountGroup: AccountGroupViewData | undefined;
}

const AccountContainer: React.FunctionComponent = () => {
    const [accountContainerState, setAccountContainerState] = useState<State>({ accounts: [], selectedAccountGroup: undefined });

    const [isOpen, setOpen] = useState(false);
    useEffect(() => {
        window.ElectronBridge.on(AccountGroupChannel.onAccountGroupSelected, handleOnAccountGroupSelected);
        window.ElectronBridge.on(AccountGroupChannel.accountsUpdated, handleOnAccountsUpdated);

        return () => {
            window.ElectronBridge.removeAllListeners(AccountGroupChannel.onAccountGroupSelected);
            window.ElectronBridge.removeAllListeners(AccountGroupChannel.accountsUpdated);
        };
    }, []);

    const handleOnAccountGroupSelected = (_, accountGroup: AccountGroupViewData, accounts: AccountViewData[]) => {
        setAccountContainerState({ accounts: accounts, selectedAccountGroup: accountGroup });
    };

    const handleOnAccountsUpdated = (_, accounts: AccountViewData[]) => {
        console.log('account updated', accounts);
        setAccountContainerState((prev) => {
            return { accounts: accounts, selectedAccountGroup: prev.selectedAccountGroup };
        });
    };

    const handleAddAccounts = () => {
        setOpen(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto', padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3}>Accounts</Title>
                {accountContainerState.selectedAccountGroup ? <Button onClick={handleAddAccounts}> Add Accounts </Button> : null}
            </div>
            {accountContainerState.selectedAccountGroup && (
                <>
                    <AccountHeaders></AccountHeaders>
                    <AccountList
                        accounts={accountContainerState.accounts}
                        selectedAccountGroup={accountContainerState.selectedAccountGroup}
                    ></AccountList>
                    <AddAccountModal
                        isOpen={isOpen}
                        setOpen={setOpen}
                        selectedAccountGroup={accountContainerState.selectedAccountGroup}
                    ></AddAccountModal>
                </>
            )}
        </div>
    );
};

export default AccountContainer;
