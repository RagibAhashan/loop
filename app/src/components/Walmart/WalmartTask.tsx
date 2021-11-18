// import styles from './sidebar.module.css';
import { WalmartCATask } from '@core/walmart/WalmartCATask';
import { WalmartUSTask } from '@core/walmart/WalmartUSTask';
import { Col, Row, Tooltip } from 'antd';
import React, { useEffect } from 'react';

interface Props {
    task: WalmartCATask | WalmartUSTask;
    style: any;
}
const WalmartTask: React.FunctionComponent<Props> = (props) => {
    const { task, style } = props;

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

    const runButton = () => {
        return <div> run button </div>;
        // return isRunning ? (
        //     <StopTaskAction storeKey={storeKey} uuid={uuid}></StopTaskAction>
        // ) : (
        //     <StartTaskAction storeKey={storeKey} uuid={uuid}></StartTaskAction>
        // );
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
                    <div style={{ display: 'flex' }}>
                        <div>{runButton()}</div>
                        <div>
                            {/* <EditTaskAction storeKey={storeKey} uuid={uuid} EditTaskModalComponent={WalmartEditTaskModal}></EditTaskAction> */}
                        </div>
                        <div>{/* <DeleteTaskAction storeKey={storeKey} uuid={uuid}></DeleteTaskAction> */}</div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default WalmartTask;
