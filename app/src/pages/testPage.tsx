import { Button, Space } from 'antd';
import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');

const TestPage = () => {
    const [data, setData] = useState({} as any);

    const columns = [
        {
            title: 'Task id',
            dataIndex: 'threadId',
            key: 'threadId',
        },
        {
            title: 'Status',
            dataIndex: 'message',
            key: 'message',
        },
    ];

    ipcRenderer.on('task-reply', (event, message) => {
        // console.log('task reply', message.message, 'from task', message.threadId);
    });

    ipcRenderer.on('workers', (event, workers) => {
        // let temp = {} as any;
        workers.forEach((id: number) => {
            console.log(id);
            // temp[id] = { threadId: id, message: 'Not started' };
        });
        // setData(temp);
        // console.log('WORKERS', temp);
    });

    const startTask = async () => {
        console.log('sending start');
        ipcRenderer.send('start-task', 5);
    };

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
            {console.log(Object.keys(data))}
            <div style={{ display: 'flex', flexDirection: 'column' }}></div>
        </div>
    );
};

export default TestPage;
