// import styles from './sidebar.module.css';
import TaskActions from '@components/TaskAction/TaskAction';
import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { WalmartCATask } from '@core/walmart/WalmartCATask';
import { WalmartUSTask } from '@core/walmart/WalmartUSTask';
import { Col, Row, Tooltip } from 'antd';
import React, { useEffect } from 'react';

interface Props {
    task: WalmartCATask | WalmartUSTask;
    style: any;
    proxySets: IProxySet[];
    profiles: IProfile[];
    groupName: string;
}
const WalmartTask: React.FunctionComponent<Props> = (props) => {
    const { task, style, proxySets, profiles, groupName } = props;

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
                <Tooltip placement="bottomLeft" title={`Retry Delay : ${task.taskData.retryDelay} ms`}>
                    <Col span={4} style={{ paddingLeft: 15, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.taskData.productSKU}</div>
                    </Col>
                </Tooltip>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.taskData.proxySet ?? 'No Proxies'}</div>
                </Col>

                <Col span={4}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.taskData.profileName}</div>
                </Col>

                <Col span={4} style={{ paddingRight: 15 }}>
                    {/* TODO */}
                    {/* {renderSize()} */}
                </Col>

                <Col span={6}>{/* <TaskStatus storeKey={storeKey} uuid={uuid}></TaskStatus> */}</Col>

                <Col flex="auto" span={2}>
                    <TaskActions groupName={groupName} proxySets={proxySets} profiles={profiles} task={task}></TaskActions>
                </Col>
            </Row>
        </div>
    );
};

export default WalmartTask;
