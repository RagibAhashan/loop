// import styles from './sidebar.module.css';
import { DeleteFilled, PlayCircleFilled, EditFilled, StopFilled } from '@ant-design/icons';
import { Button, Col, Row, Tooltip } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Subscription } from 'rxjs';
import { TASK_STOPPED, NOTIFY_STOP_TASK, NOTIFY_START_TASK } from '../../common/Constants';
import { Proxies } from '../../interfaces/OtherInterfaces';
import { TaskData, UserProfile } from '../../interfaces/TaskInterfaces';
import { TaskService } from '../../services/TaskService';
import EditTaskModal from './EditTaskModal';
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
        notify,
        taskData,
        deleteBot,
        editBot,
        storeName,
        style,
    }: {
        notify: boolean;
        taskData: TaskData;
        deleteBot: any;
        editBot: any;
        storeName: string;
        style: any;
    } = props;

    const {
        uuid,
        productSKU,
        profile,
        sizes,
        proxySet,
        retryDelay,
    }: { uuid: string; productSKU: string; profile: string; sizes: string[]; proxySet: string | undefined; retryDelay: number } = taskData;

    const [status, setStatus] = useState(() => getLastStatus(uuid).lastStatus as string);
    const [running, setRunning] = useState(() => getLastStatus(uuid).running as boolean);
    const [statusLevel, setStatusLevel] = useState(() => getLastStatus(uuid).lastLevel as string);
    const [editModalVisible, setEditModalVisible] = useState(false);

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

    const assignProxy = () => {
        const proxies = JSON.parse(localStorage.getItem('proxies') as string) as Proxies;
        if (!proxies) return undefined;
        const set = proxies[proxySet as string];
        // no proxies in the set
        if (set.length === 0) return undefined;

        //look for unused proxy and assign it to task
        for (const proxy of set) {
            const alreadyUsed = proxy.usedBy.find((id) => id === uuid);

            if (alreadyUsed) return proxy;

            // todo also check for test status (not banned)
            if (proxy.usedBy.length === 0) {
                proxy.usedBy.push(uuid);
                localStorage.setItem('proxies', JSON.stringify(proxies));
                return proxy;
            }
        }

        set[0].usedBy.push(uuid);
        localStorage.setItem('proxies', JSON.stringify(proxies));

        // if all proxies are being used just take the first one
        return set[0];
    };

    const startTask = () => {
        setRunning(true);
        const profiles = JSON.parse(localStorage.getItem('profiles') as string) as UserProfile[];
        const profileData = profiles.find((prof) => prof.profile === profile);
        let proxyData = undefined;
        if (proxySet) proxyData = assignProxy();
        const deviceId = localStorage.getItem('deviceId');
        ipcRenderer.send(NOTIFY_START_TASK, uuid, storeName, { productSKU, profileData, proxyData, sizes, retryDelay, deviceId });
    };

    useEffect(() => {
        const notifySub = TaskService.listenStart().subscribe(() => {
            startTask();
        });

        registerTaskStatusListener();

        return () => {
            ipcRenderer.removeAllListeners(uuid);
            ipcRenderer.removeAllListeners(uuid + TASK_STOPPED);
            notifySub.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stopTask = () => {
        setRunning(false);
        ipcRenderer.send(NOTIFY_STOP_TASK, uuid);
    };

    const deleteMe = () => {
        unassignProxy();
        deleteBot(uuid);
    };

    const unassignProxy = () => {
        if (!proxySet) return;

        const proxies = JSON.parse(localStorage.getItem('proxies') as string) as Proxies;
        if (!proxies) return;

        const set = proxies[proxySet];
        //look for unused proxy and assign it to task
        for (const proxy of set) {
            const isUsed = proxy.usedBy.findIndex((id) => id === uuid);

            if (isUsed) {
                proxy.usedBy.splice(isUsed, 1);
                localStorage.setItem('proxies', JSON.stringify(proxies));
            }
        }
    };

    const openEditModal = () => {
        setEditModalVisible(true);
    };

    const confirmEdit = (newValues: TaskData) => {
        editBot(newValues, uuid);
        setEditModalVisible(false);
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
        <>
            <Row
                align="middle"
                style={{
                    ...style,
                    backgroundColor: '#282c31',
                    borderRadius: 5,
                    height: style.height - 5,
                    whiteSpace: 'nowrap',
                }}
            >
                <Col span={4} style={{ paddingLeft: 15, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{productSKU}</div>
                </Col>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{proxySet ? proxySet : 'No Proxies'}</div>
                </Col>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile}</div>
                </Col>

                <Col span={4} style={{ paddingRight: 15 }}>
                    <Tooltip title={sizes.join(', ')}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sizes.join(', ')}</div>
                    </Tooltip>
                </Col>

                <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg height="6" width="6">
                            <circle cx="3" cy="3" r="3" fill={statusColor(statusLevel)} />
                        </svg>
                        <span
                            style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: statusColor(statusLevel), fontWeight: 500, marginLeft: 5 }}
                        >
                            {status}
                        </span>
                    </div>
                </Col>

                <Col flex="auto" span={2}>
                    <div style={{ display: 'flex' }}>
                        <div>{runButton()}</div>
                        <div>
                            <Button
                                onClick={() => {
                                    openEditModal();
                                }}
                                style={editButton}
                                size="small"
                                icon={<EditFilled />}
                            />
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    deleteMe();
                                }}
                                style={deleteButton}
                                icon={<DeleteFilled />}
                                size="small"
                            />
                        </div>
                    </div>
                </Col>
            </Row>

            <EditTaskModal
                taskData={taskData}
                visible={editModalVisible}
                confirmEdit={confirmEdit}
                cancelEditModal={() => setEditModalVisible(false)}
            />
        </>
    );
};

export default Bot;
