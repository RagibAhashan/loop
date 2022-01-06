import TaskActions from '@components/actions/task-actions';
import TaskStatus from '@components/task-status/task-status';
import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { WalmartTaskViewData } from '@core/walmart/walmart-task';
import { Col, Row, Tooltip } from 'antd';
import React, { useEffect } from 'react';

interface Props {
    task: WalmartTaskViewData;
    style: any;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    groupName: string;
}
const WalmartTask: React.FunctionComponent<Props> = (props) => {
    const { task, style, proxySets, profileGroups, groupName } = props;

    const isRunning = false;

    const registerTaskStatusListener = () => {
        // Rocket emoji waterfall
        // window.ElectronBridge.once(uuid + TASK_SUCCESS, () => {
        //     const myNotification = new Notification('Checkout !', {
        //         body: `Walmart Checked Out! 🚀🌑`,
        //     });
        //     setTimeout(() => {
        //         myNotification.close();
        //     }, 2000);
        // });
    };

    useEffect(() => {
        // registerTaskStatusListener();

        return () => {
            // window.ElectronBridge.removeAllListeners(uuid + TASK_SUCCESS);
        };
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
                <Tooltip placement="bottomLeft" title={`Retry Delay : ${task.retryDelay} ms`}>
                    <Col span={4} style={{ paddingLeft: 15, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.productSKU}</div>
                    </Col>
                </Tooltip>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.proxySetName ?? 'No Proxies'}</div>
                </Col>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.profileName}</div>
                </Col>

                <Col span={4} style={{ paddingRight: 15 }}>
                    {/* TODO */}
                    {/* {renderSize()} */}
                </Col>

                <Col span={6}>
                    <TaskStatus groupName={groupName} task={task}></TaskStatus>
                </Col>

                <Col flex="auto" span={2}>
                    <TaskActions groupName={groupName} proxySets={proxySets} profileGroups={profileGroups} task={task}></TaskActions>
                </Col>
            </Row>
        </div>
    );
};

export default WalmartTask;
