import { Button, Space } from 'antd';
import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');

const TestPage = () => {
    const [data, setData] = useState({ id: '', message: '' } as any);

    const startTask = async () => {};

    const stop = () => {
        ipcRenderer.send('stop-task');
    };

    return (
        <div>
            <Space>
                <Button type="primary" onClick={() => startTask()}>
                    start a task
                </Button>
                <Button type="primary" onClick={() => stop()}>
                    stop a task
                </Button>
            </Space>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.keys(data).map((val) => {
                    return (
                        <div>
                            <p>{data[val].id}</p>
                            <p>{data[val].message}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TestPage;
