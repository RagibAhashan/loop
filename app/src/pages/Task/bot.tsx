// import styles from './sidebar.module.css';
import { DeleteOutlined, DoubleRightOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

interface Status {
    status: string;
    level: 'error' | 'status' | 'info' | 'idle';
    lastStatus?: string;
    lastLevel?: string;
}

const botStyle = {
    backgroundColor: '#212427',
    marginTop: '10px',
    borderRadius: '8px',
};

const colStyle = {
    // margin: 'auto',
};

const editButton = {
    border: 'none',
    borderRadius: '100%',
    backgroundColor: 'orange',
};

const startButton = {
    border: 'none',
    borderRadius: '100%',
    backgroundColor: 'green',
};

const stopButton = {
    border: 'none',
    borderRadius: '100%',
    backgroundColor: 'red',
};

const deleteButton = {
    border: 'none',
    borderRadius: '100%',
    backgroundColor: 'red',
};

const statusColor = (level: string) => {
    switch (level) {
        case 'idle':
            return 'yellow';
        case 'info':
            return 'white';
        case 'success':
            return 'green';
        case 'error':
            return 'red';
    }
};

const getLastStatus = (uuid: string): Status => {
    const item = JSON.parse(localStorage.getItem(uuid) as string);
    return item ? item : { lastStatus: 'Idle', lastLevel: 'idle' };
};

const Bot = (props: any) => {
    const { uuid, productLink, profile, sizes, proxyset, retrydelay, deleteBot, style } = props;

    const [status, setStatus] = useState(() => getLastStatus(uuid).lastStatus as string);
    const [running, setRunning] = useState(false);
    const [statusLevel, setStatusLevel] = useState(() => getLastStatus(uuid).lastLevel as string);

    const registerTaskStatusListener = () => {
        ipcRenderer.on(uuid, (event, status: Status) => {
            setStatus((prevStatus) => (prevStatus = status.status));
            setStatusLevel((prevLevel) => (prevLevel = status.level));
            localStorage.setItem(uuid, JSON.stringify({ lastStatus: status.status, lastLevel: status.level }));
        });
    };

    const startTask = () => {
        setRunning((prevRunning) => (prevRunning = !prevRunning));
        ipcRenderer.send('start-task', uuid);
    };

    useEffect(() => {
        registerTaskStatusListener();

        return () => {
            ipcRenderer.removeAllListeners(uuid);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stopTask = () => {
        // ipcRenderer.removeAllListeners(uuid);
        setRunning((prevRunning) => (prevRunning = !prevRunning));
        // setStatusLevel((prevLevel) => (prevLevel = 'idle'));
        // setStatus((prevStatus) => (prevStatus = 'Idle'));
        ipcRenderer.send('stop-task', uuid);
    };

    const runButton = () => {
        return running ? (
            <Button
                onClick={() => {
                    stopTask();
                }}
                style={stopButton}
                icon={<StopOutlined />}
                size="small"
            />
        ) : (
            <Button
                onClick={() => {
                    startTask();
                }}
                style={startButton}
                icon={<DoubleRightOutlined />}
                size="small"
            />
        );
    };

    return (
        <Row gutter={[14, 0]} style={style}>
            <Col span={4} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div>{productLink}</div>
            </Col>

            <Col span={4}>
                <p>{proxyset}</p>
            </Col>

            <Col span={4}>{profile}</Col>

            <Col span={4} style={{ padding: 10 }}>
                {sizes.map((size: string) => (
                    <Tag>{size}</Tag>
                ))}
            </Col>

            <Col span={4}>
                <p style={{ color: statusColor(statusLevel), margin: 'auto' }}>{status}</p>
            </Col>

            <Col span={4}>
                <Space>
                    {runButton()}
                    <Button style={editButton} size="small" icon={<EditOutlined />} />
                    <Button
                        onClick={() => {
                            deleteBot(uuid);
                        }}
                        style={deleteButton}
                        icon={<DeleteOutlined />}
                        size="small"
                    />
                </Space>
            </Col>
        </Row>
    );
};

export default Bot;
