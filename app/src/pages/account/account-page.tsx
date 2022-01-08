import AccountGroupContainer from '@components/account-group/account-group-container';
import AccountContainer from '@components/account/account-container';
import React from 'react';

const AccountPage = () => {
    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}>
            <div
                style={{
                    width: '250px',
                    height: '100%',
                    backgroundColor: '#2a2e31',
                }}
            >
                <AccountGroupContainer></AccountGroupContainer>
            </div>
            <div style={{ height: '100%', width: '100%' }}>
                <AccountContainer></AccountContainer>
            </div>
        </div>
    );
};

export default AccountPage;
