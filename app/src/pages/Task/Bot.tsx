// import styles from './sidebar.module.css';
import { DeleteFilled, EditFilled, PlayCircleFilled, QuestionCircleOutlined, StopFilled } from '@ant-design/icons';
import { Button, Col, Popconfirm, Row, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { TASK_STOPPED, TASK_SUCCESS } from '../../common/Constants';
import { Proxies } from '../../interfaces/OtherInterfaces';
import { TaskData } from '../../interfaces/TaskInterfaces';
import { taskService } from '../../services/TaskService';
import EditTaskModal from './EditTaskModal';
const { ipcRenderer } = window.require('electron');

interface Status {
    status: string;
    level: 'error' | 'status' | 'info' | 'idle' | 'cancel' | 'success';
    running: boolean;
    lastStatus?: string;
    lastLevel?: string;
    checkedSize?: string;
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
            return '#faa61a';
        case 'info':
            return 'white';
        case 'success':
            return 'green';
        case 'error':
            return '#ff001e';
        case 'cancel':
            return '#f7331e';
        default:
            return 'white';
    }
};

const getLastStatus = (uuid: string): Status => {
    const item = JSON.parse(localStorage.getItem(uuid) as string);
    return item
        ? { ...item, running: item.lastLevel === 'cancel' || item.lastLevel === 'success' ? false : true }
        : { lastStatus: 'Idle', lastLevel: 'idle', running: false };
};

const Bot = (props: any) => {
    const {
        taskData,
        deleteBot,
        editBot,
        style,
        startTask,
        stopTask,
    }: {
        taskData: TaskData;
        deleteBot: any;
        editBot: any;
        storeName: string;
        style: any;
        startTask: (taskData: TaskData) => {};
        stopTask: (uuid: string) => {};
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
    const [disabled, setDisabled] = useState(false);
    const [currentSize, setCurrentSize] = useState<string | undefined>(() => getLastStatus(uuid).checkedSize);

    const registerTaskStatusListener = () => {
        ipcRenderer.on(uuid, (event, status: Status) => {
            setStatus(status.status);
            setStatusLevel(status.level);
            setRunning(true);

            if (status.checkedSize) setCurrentSize(status.checkedSize as string);
            if (status.level === 'success' || status.level === 'cancel') {
                setRunning(false);
            }
            localStorage.setItem(uuid, JSON.stringify({ lastStatus: status.status, lastLevel: status.level, checkedSize: status.checkedSize }));
        });

        ipcRenderer.on(uuid + TASK_STOPPED, () => {
            setRunning(false);
            setCurrentSize(undefined);
            setDisabled(false);
        });

        // Rocket emoji waterfall
        ipcRenderer.once(uuid + TASK_SUCCESS, () => {
            console.log('TASK SUCCESS');

            setRunning(false);
            const myNotification = new Notification('Checkout !', {
                body: `Checked Out Size ${currentSize} ! 🚀🌑`,
            });

            setTimeout(() => {
                myNotification.close();
            }, 2000);
        });
    };

    useEffect(() => {
        registerTaskStatusListener();

        return () => {
            ipcRenderer.removeAllListeners(uuid);
            ipcRenderer.removeAllListeners(uuid + TASK_STOPPED);
            ipcRenderer.removeAllListeners(uuid + TASK_SUCCESS);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _startTask = () => {
        startTask({ uuid, productSKU, sizes, retryDelay, profile, proxySet });
        setRunning(true);
        taskService.setRunning(taskData.store as string, taskData.uuid, true);
    };

    const _stopTask = () => {
        stopTask(uuid);
        setDisabled(true);
        taskService.setRunning(taskData.store as string, taskData.uuid, false);
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
                    _stopTask();
                }}
                style={stopButton}
                icon={<StopFilled />}
                size="small"
                disabled={disabled}
            />
        ) : (
            <Button
                onClick={() => {
                    _startTask();
                }}
                style={startButton}
                icon={<PlayCircleFilled />}
                size="small"
                disabled={disabled}
            />
        );
    };

    const renderSize = () => {
        return currentSize ? (
            <Tag color="gold">{currentSize}</Tag>
        ) : (
            <Tooltip title={sizes.join(', ')} placement="topLeft">
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sizes.join(', ')}</div>
            </Tooltip>
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
                    userSelect: 'none',
                }}
            >
                <Tooltip placement="bottomLeft" title={`Retry Delay : ${retryDelay} ms`}>
                    <Col span={4} style={{ paddingLeft: 15, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{productSKU}</div>
                    </Col>
                </Tooltip>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{proxySet ? proxySet : 'No Proxies'}</div>
                </Col>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile}</div>
                </Col>

                <Col span={4} style={{ paddingRight: 15 }}>
                    {renderSize()}
                </Col>

                <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg height="6" width="6">
                            <circle cx="3" cy="3" r="3" fill={statusColor(statusLevel)} />
                        </svg>
                        <span
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: statusColor(statusLevel),
                                fontWeight: 500,
                                marginLeft: 5,
                                flex: 1,
                            }}
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
                                disabled={running}
                            />
                        </div>
                        <div>
                            <Popconfirm
                                title="Are you sure？"
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onConfirm={deleteMe}
                                onCancel={() => {}}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button style={deleteButton} icon={<DeleteFilled />} size="small" />
                            </Popconfirm>
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
