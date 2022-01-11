import { AccountGroupViewData } from '@core/account-group';
import { AccountViewData } from '@core/models/account';
import { Empty } from 'antd';
import React from 'react';
import { FixedSizeList } from 'react-window';
import Account from './account';

interface Props {
    accounts: AccountViewData[];
    selectedAccountGroup: AccountGroupViewData;
}
const AccountList: React.FunctionComponent<Props> = (props) => {
    const { accounts, selectedAccountGroup } = props;

    const renderAccounts = (element: any) => {
        const { index, style } = element;

        return <Account key={accounts[index].id} account={accounts[index]} selectedAccountGroup={selectedAccountGroup} style={style} />;
    };

    return accounts.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span style={{ fontSize: '20px', fontWeight: 500 }}>No accounts 🐱‍💻 </span>} />
        </div>
    ) : (
        <FixedSizeList height={700} itemCount={accounts.length} itemSize={45} width="100%" style={{ flex: 1, padding: 10 }}>
            {renderAccounts}
        </FixedSizeList>
    );
};

export default AccountList;
