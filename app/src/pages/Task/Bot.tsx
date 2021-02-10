// import styles from './sidebar.module.css';
import { DeleteFilled, PlayCircleFilled, EditFilled, StopFilled } from '@ant-design/icons';
import { Button, Col, Row, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { TASK_STOPPED, NOTIFY_STOP_TASK, NOTIFY_START_TASK } from '../../common/Constants';
import { UserProfile } from '../../interfaces/TaskInterfaces';
const { ipcRenderer } = window.require('electron');

interface Status {
    status: string;
    level: 'error' | 'status' | 'info' | 'idle' | 'cancel';
    running: boolean;
    lastStatus?: string;
    lastLevel?: string;
}

const editButton = {
    border: 'none',
    borderRadius: '100%',
    color: 'orange',
};

const startButton = {
    border: 'none',
    borderRadius: '100%',
    color: 'green',
};

const stopButton = {
    border: 'none',
    borderRadius: '100%',
    color: '#fc3d03',
};

const deleteButton = {
    border: 'none',
    borderRadius: '100%',
    color: 'red',
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
        case 'cancel':
            return '#f7331e';
    }
};

const getLastStatus = (uuid: string): Status => {
    const item = JSON.parse(localStorage.getItem(uuid) as string);
    return item ? { ...item, running: item.lastLevel === 'cancel' ? false : true } : { lastStatus: 'Idle', lastLevel: 'idle', running: false };
};

const Bot = (props: any) => {
    const {
        uuid,
        productLink,
        productSKU,
        profile,
        sizes,
        proxySet,
        retryDelay,
        deleteBot,
        storeName,
        style,
    }: {
        uuid: string;
        productLink: string;
        productSKU: string;
        profile: string;
        sizes: string[];
        proxySet: string;
        retryDelay: number;
        deleteBot: any;
        storeName: string;
        captchaWinId: number;
        style: any;
    } = props;

    const [status, setStatus] = useState(() => getLastStatus(uuid).lastStatus as string);
    const [running, setRunning] = useState(() => getLastStatus(uuid).running as boolean);
    const [statusLevel, setStatusLevel] = useState(() => getLastStatus(uuid).lastLevel as string);

    const registerTaskStatusListener = () => {
        ipcRenderer.on(uuid, (event, status: Status) => {
            setStatus((prevStatus) => (prevStatus = status.status));
            setStatusLevel((prevLevel) => (prevLevel = status.level));
            localStorage.setItem(uuid, JSON.stringify({ lastStatus: status.status, lastLevel: status.level }));
        });

        ipcRenderer.on(uuid + TASK_STOPPED, () => {
            setRunning(false);
        });
    };

    const startTask = () => {
        setRunning(true);
        const profiles = JSON.parse(localStorage.getItem('profiles') as string) as UserProfile[];
        console.log('profile', profiles);
        const profileData = profiles.find((prof) => prof.profile === profile);
        console.log(profileData);
        const proxyData = ''; //localStorage.getItem(proxyset as string);
        const deviceId = localStorage.getItem('deviceId');
        ipcRenderer.send(NOTIFY_START_TASK, uuid, storeName, { productLink, productSKU, profileData, proxyData, sizes, retryDelay, deviceId });
    };

    useEffect(() => {
        registerTaskStatusListener();

        return () => {
            ipcRenderer.removeAllListeners(uuid);
            ipcRenderer.removeAllListeners(uuid + TASK_STOPPED);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stopTask = () => {
        setRunning(false);
        ipcRenderer.send(NOTIFY_STOP_TASK, uuid);
    };

    const runButton = () => {
        return running ? (
            <Button
                onClick={() => {
                    stopTask();
                }}
                style={stopButton}
                icon={<StopFilled />}
                size="small"
            />
        ) : (
            <Button
                onClick={() => {
                    startTask();
                }}
                style={startButton}
                icon={<PlayCircleFilled />}
                size="small"
            />
        );
    };

    return (
        <Row
            align="middle"
            style={{
                ...style,
                backgroundColor: '#282c31',
                borderRadius: 60,
                height: style.height - 5,
                textAlign: 'center',
                whiteSpace: 'nowrap',
            }}
        >
            <Col span={4} style={{ paddingLeft: 10, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{productSKU}</div>
            </Col>

            <Col span={4}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{proxySet ? proxySet : 'No Proxies'}</div>
            </Col>

            <Col span={4}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile}</div>
            </Col>

            <Col span={4} style={{ padding: 10 }}>
                <Tooltip title={sizes.join(', ')}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sizes.join(', ')}</div>
                </Tooltip>
            </Col>

            <Col span={4}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg height="6" width="6">
                        <circle cx="3" cy="3" r="3" fill={statusColor(statusLevel)} />
                    </svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: statusColor(statusLevel), fontWeight: 500, marginLeft: 5 }}>
                        {status}
                    </span>
                </div>
            </Col>

            <Col span={4}>
                <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '5px' }}>
                    <div>{runButton()}</div>
                    <div>
                        <Button style={editButton} size="small" icon={<EditFilled />} />
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                deleteBot(uuid);
                            }}
                            style={deleteButton}
                            icon={<DeleteFilled />}
                            size="small"
                        />
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default Bot;
