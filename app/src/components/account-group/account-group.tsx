import { CloseCircleOutlined } from '@ant-design/icons';
import Editable from '@components/base/editable';
import { AccountGroupViewData } from '@core/account-group';
import { AccountGroupChannel } from '@core/ipc-channels';
import { Button } from 'antd';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
    accountGroup: AccountGroupViewData;
    selectedAccountGroup: AccountGroupViewData | undefined;
}

const AccountGroup: React.FunctionComponent<Props> = (props) => {
    const { accountGroup, selectedAccountGroup } = props;

    const isSelected = selectedAccountGroup ? accountGroup.id === selectedAccountGroup.id : false;

    const handleClickAccountGroup = () => {
        window.ElectronBridge.send(AccountGroupChannel.getAllAccountsFromGroup, accountGroup.id);
    };
    const handleRemoveAccountGroup = (event) => {
        window.ElectronBridge.send(AccountGroupChannel.removeAccountGroup, accountGroup.id);
        event.stopPropagation();
    };

    const handleAccountGroupNameEdit = (value: string) => {
        window.ElectronBridge.send(AccountGroupChannel.editAccountGroupName, accountGroup.id, value);
    };

    return (
        <div
            style={{
                width: '190px',
                height: '100px',
                backgroundColor: '#212427',
                padding: 10,
                margin: 10,
                borderRadius: 5,
                border: isSelected ? '1px solid rgb(177 142 15 / 92%)' : undefined,
            }}
            onClick={handleClickAccountGroup}
        >
            <div>
                <Button type="primary" shape="circle" icon={<CloseCircleOutlined />} onClick={handleRemoveAccountGroup} />
            </div>
            <div>
                <Editable value={accountGroup.name} onSubmit={handleAccountGroupNameEdit} />
            </div>
        </div>
    );
};

export default AccountGroup;
