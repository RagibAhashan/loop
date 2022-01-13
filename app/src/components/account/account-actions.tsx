import { DeleteOutlined, EditOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { AccountGroupChannel } from '@core/ipc-channels';
import { AccountViewData } from '@core/models/account';
import { Button } from 'antd';
import React from 'react';

interface Props {
    account: AccountViewData;
}
const AccountActions: React.FunctionComponent<Props> = (props) => {
    const { account } = props;

    const handleLogin = () => {
        console.log('login ');
        window.ElectronBridge.send(AccountGroupChannel.logIn, account.groupId, account.id);
    };

    const handleLogout = () => {
        window.ElectronBridge.send(AccountGroupChannel.logOut, account.groupId, account.id);
    };

    const renderLoginButton = () => {
        return account.loggedIn ? (
            <div>
                <Button onClick={handleLogout} icon={<LogoutOutlined />} size="small" />
            </div>
        ) : (
            <div>
                <Button onClick={handleLogin} icon={<LoginOutlined />} size="small" />
            </div>
        );
    };

    const handleEdit = () => {};

    const handleDelete = () => {
        window.ElectronBridge.send(AccountGroupChannel.removeAccountFromGroup, account.groupId, [account.id]);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div>{renderLoginButton()}</div>
            <div>
                <Button onClick={handleEdit} icon={<EditOutlined />} size="small" />
            </div>
            <div>
                <Button onClick={handleDelete} icon={<DeleteOutlined />} size="small"></Button>
            </div>
        </div>
    );
};

export default AccountActions;
