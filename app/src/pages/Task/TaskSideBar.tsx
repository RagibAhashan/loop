import React, { useState, useEffect } from 'react';
import { Space } from 'antd';
import StoreButton from './StoreButton'

const TaskSideBar = () => {

    return (
        <div style={{ minHeight: '100vh' }}>
            <StoreButton />
        </div>
    )
}


export default TaskSideBar;