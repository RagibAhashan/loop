import TaskActions from '@components/actions/task-actions';
import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/taskgroup';
import { Tooltip } from 'antd';
import React, { useEffect } from 'react';
import TaskStatus from './task-status';

interface Props {
    task: TaskViewData;
    style: any;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    taskGroup: TaskGroupViewData;
}

interface Props {
    task: TaskViewData;
    style: any;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    taskGroup: TaskGroupViewData;
}
const Task: React.FunctionComponent<Props> = (props) => {
    const { task, style, proxySets, profileGroups, taskGroup } = props;

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
            <div
                className="task-row"
                style={{
                    height: style.height - 5,
                }}
            >
                <Tooltip placement="bottomLeft" title={`Retry Delay : ${task.retryDelay} ms`}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.productIdentifier}</div>
                </Tooltip>

                <div className="task-item">{task.profileName}</div>

                <div className="task-item">{task.proxySetName}</div>

                <div className="task-item">{task.accountName}</div>

                <div>
                    <TaskStatus task={task}></TaskStatus>
                </div>

                <div>
                    <TaskActions taskGroup={taskGroup} proxySets={proxySets} profileGroups={profileGroups} task={task}></TaskActions>
                </div>
            </div>
        </div>
    );
};

export default Task;
