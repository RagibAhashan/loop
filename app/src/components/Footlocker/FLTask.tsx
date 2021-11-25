// import styles from './sidebar.module.css';
import TaskActions from '@components/TaskAction/TaskActions';
import { FootLockerTask } from '@core/footlocker/FootLockerTask';
import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { Col, Row, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import TaskStatus from '../TaskStatus/TaskStatus';

interface Props {
    task: FootLockerTask;
    style: any;
    proxySets: IProxySet[];
    profiles: IProfile[];
    groupName: string;
}

const FLTask: React.FunctionComponent<Props> = (props) => {
    const { task, style, profiles, proxySets, groupName } = props;

    const isRunning = false;

    const registerTaskStatusListener = () => {
        // Rocket emoji waterfall
        // window.ElectronBridge.once(uuid + TASK_SUCCESS, () => {
        //     const myNotification = new Notification('Checkout !', {
        //         body: `Checked Out! 🚀🌑`,
        //     });
        //     setTimeout(() => {
        //         myNotification.close();
        //     }, 2000);
        // });
    };

    useEffect(() => {
        // registerTaskStatusListener();
        // return () => {
        //     window.ElectronBridge.removeAllListeners(uuid + TASK_SUCCESS);
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <Tooltip placement="bottomLeft" title={`Retry Delay : ${task.taskData.retryDelay} ms`}>
                    <Col span={4} style={{ paddingLeft: 15, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>productSKU</div>
                    </Col>
                </Tooltip>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.taskData.proxySet ? task.taskData.proxySet : 'No Proxies'}
                    </div>
                </Col>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.taskData.profileName}</div>
                </Col>

                <Col span={4} style={{ paddingRight: 15 }}>
                    {/* TODO */}
                    {/* {renderSize()} */}
                </Col>

                <Col span={6}>
                    <TaskStatus status={task.status}></TaskStatus>
                </Col>

                <Col flex="auto" span={2}>
                    <TaskActions groupName={groupName} profiles={profiles} proxySets={proxySets} task={task}></TaskActions>
                </Col>
            </Row>
        </div>
    );
};

export default FLTask;
