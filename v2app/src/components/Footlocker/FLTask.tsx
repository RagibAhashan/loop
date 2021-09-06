// import styles from './sidebar.module.css';
import { Col, Row, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TASK_SUCCESS } from '../../common/Constants';
import { StoreType } from '../../constants/Stores';
import { AppState } from '../../global-store/GlobalStore';
import { FLTaskData } from '../../interfaces/TaskInterfaces';
import { getTaskById } from '../../services/Store/StoreService';
import DeleteTaskAction from '../DeleteTaskAction/DeleteTaskAction';
import EditTaskAction from '../EditTaskAction/EditTaskAction';
import StartTaskAction from '../StartTaskAction/StartTaskAction';
import StopTaskAction from '../StopTaskAction/StopTaskAction';
import TaskStatus from '../TaskStatus/TaskStatus';
import { FLEditTaskModal } from './FLEditTaskModal';
const { ipcRenderer } = window.require('electron');

const FLTask = (props: any) => {
    const {
        uuid,
        style,
        storeKey,
    }: {
        uuid: string;
        style: any;
        storeKey: StoreType;
    } = props;

    const task = useSelector((state: AppState) => getTaskById(state, storeKey, uuid)) as FLTaskData;
    const isRunning = task.running;

    const registerTaskStatusListener = () => {
        // Rocket emoji waterfall
        ipcRenderer.once(uuid + TASK_SUCCESS, () => {
            const myNotification = new Notification('Checkout !', {
                body: `Checked Out! 🚀🌑`,
            });

            setTimeout(() => {
                myNotification.close();
            }, 2000);
        });
    };

    useEffect(() => {
        registerTaskStatusListener();

        return () => {
            ipcRenderer.removeAllListeners(uuid + TASK_SUCCESS);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const runButton = () => {
        return isRunning ? (
            <StopTaskAction storeKey={storeKey} uuid={uuid}></StopTaskAction>
        ) : (
            <StartTaskAction storeKey={storeKey} uuid={uuid}></StartTaskAction>
        );
    };

    return (
        <div style={style}>
            <Row
                align="middle"
                style={{
                    backgroundColor: '#282c31',
                    borderRadius: 5,
                    height: style.height - 5,
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                }}
            >
                <Tooltip placement="bottomLeft" title={`Retry Delay : ${task.retryDelay} ms`}>
                    <Col span={4} style={{ paddingLeft: 15, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.productSKU}</div>
                    </Col>
                </Tooltip>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.proxySet ? task.proxySet : 'No Proxies'}</div>
                </Col>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.profileName}</div>
                </Col>

                <Col span={4} style={{ paddingRight: 15 }}>
                    {/* TODO */}
                    {/* {renderSize()} */}
                </Col>

                <Col span={6}>
                    <TaskStatus storeKey={storeKey} uuid={uuid}></TaskStatus>
                </Col>

                <Col flex="auto" span={2}>
                    <div style={{ display: 'flex' }}>
                        <div>{runButton()}</div>
                        <div>
                            <EditTaskAction storeKey={storeKey} uuid={uuid} EditTaskModalComponent={FLEditTaskModal}></EditTaskAction>
                        </div>
                        <div>
                            <DeleteTaskAction storeKey={storeKey} uuid={uuid}></DeleteTaskAction>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default FLTask;
