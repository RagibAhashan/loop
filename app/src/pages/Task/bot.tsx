// import styles from './sidebar.module.css';
import { DeleteOutlined, DoubleRightOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

interface Status {
    status: string;
    level: string;
}

const botStyle = {
    backgroundColor: '#212427',
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '10px',
    height: '45px',
    borderRadius: '60px',
};

const colStyle = {
    margin: 'auto',
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

const Bot = (props: any) => {
    const { uuid, store, keyword, startdate, starttime, profile, sizes, proxyset, quantity, monitordelay, retrydelay, deleteBot } = props;

    const [status, setStatus] = useState('Idle');
    const [running, setRunning] = useState(false);
    const [statusLevel, setStatusLevel] = useState('idle');

    ipcRenderer.on(uuid, (event, status: Status) => {
        setStatus((prevStatus) => (prevStatus = status.status));
        setStatusLevel((prevLevel) => (prevLevel = status.level));
    });

    const startTask = () => {
        setRunning((prevRunning) => (prevRunning = !prevRunning));
        ipcRenderer.send('start-task', uuid);
    };

    const stopTask = () => {
        console.log('remove all listeners');
        ipcRenderer.removeAllListeners(uuid);
        setRunning((prevRunning) => (prevRunning = !prevRunning));
        setStatusLevel((prevLevel) => (prevLevel = 'idle'));
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

    useEffect(() => {
        let sizes_string = sizes[0];
        if (sizes.length > 1) {
            for (let i = 1; i < sizes.length; i++) {
                sizes_string += ' - ' + sizes[i];
            }
        }
        console.log(sizes_string);
    }, []);

    const allSizes = () => {
        let sizes_string = sizes[0];
        if (sizes.length > 1) {
            for (let i = 1; i < sizes.length; i++) {
                sizes_string += ' - ' + sizes[i];
            }
        }
        console.log(sizes_string);
        return sizes_string;
    };

    return (
        <Row style={botStyle}>
            <Col span={2} style={{ margin: 'auto', marginLeft: '10px' }}>
                {'Footlocker'}
            </Col>

            <Col span={3} style={colStyle}>
                {keyword}
            </Col>

            <Col span={2} style={colStyle}>
                {proxyset}
            </Col>

            <Col span={3} style={colStyle}>
                {profile}
            </Col>

            <Col span={7} style={colStyle}>
                {allSizes()}
            </Col>

            <Col span={3} style={colStyle}>
                <p style={{ color: statusColor(statusLevel), margin: 'auto' }}>{status}</p>
            </Col>

            <Col span={3} style={colStyle}>
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
