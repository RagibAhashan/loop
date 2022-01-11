import React from 'react';
const AccountHeaders: React.FunctionComponent = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly', rowGap: '20px', fontSize: '18px', marginBottom: 20, userSelect: 'none' }}>
            <div>Name</div>
            <div>Email</div>
            <div>Password</div>
            <div>Status</div>
            <div>Actions</div>
        </div>
    );
};

export default AccountHeaders;
