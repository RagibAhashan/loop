import { AccountGroupViewData } from '@core/account-group';
import { AccountGroupChannel } from '@core/ipc-channels';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AccountGroupList from './account-group-list';
import AddAccountGroupModal from './add-account-group-modal';

const AccountGroupContainer: React.FunctionComponent = () => {
    const [accountGroups, setAccountGroups] = useState<AccountGroupViewData[]>([]);

    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        window.ElectronBridge.invoke(AccountGroupChannel.getAllAccountsFromGroup).then((data: AccountGroupViewData[]) => {
            setAccountGroups(data);
        });

        window.ElectronBridge.on(AccountGroupChannel.accountGroupsUpdated, handleAccountGroupUpdated);
        window.ElectronBridge.on(AccountGroupChannel.accountGroupError, handleAccountGroupExists);

        return () => {
            window.ElectronBridge.removeAllListeners(AccountGroupChannel.accountGroupsUpdated);
            window.ElectronBridge.removeAllListeners(AccountGroupChannel.accountGroupError);
        };
    }, []);

    const handleAccountGroupUpdated = (_, accountGroups: AccountGroupViewData[], msg) => {
        setAccountGroups(accountGroups);
        if (msg) message.success(msg, 2);
    };

    const handleAccountGroupExists = (_) => {
        message.error('Account Group Already Exists', 2);
    };

    const handleAddAccountGroup = () => {
        setOpen(true);
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
            <Button style={{ marginBottom: 10 }} onClick={handleAddAccountGroup}>
                Add Account Group
            </Button>

            <AccountGroupList accountGroups={accountGroups}> </AccountGroupList>
            <AddAccountGroupModal isOpen={isOpen} setOpen={setOpen}></AddAccountGroupModal>
        </div>
    );
};

export default AccountGroupContainer;
