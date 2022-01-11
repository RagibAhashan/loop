import React from 'react';

const TaskHeaders: React.FunctionComponent<any> = (props) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly', rowGap: '20px', fontSize: '18px', marginBottom: 20, userSelect: 'none' }}>
            <div>Product</div>

            <div>Profile</div>

            <div>Proxy</div>

            <div>Account</div>

            <div>Status</div>

            <div>Actions</div>
        </div>
    );
};

export default TaskHeaders;
