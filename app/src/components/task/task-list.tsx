import Task from '@components/task/task';
import { ProfileGroupViewData } from '@core/profile-group';
import { ProxyGroupViewData } from '@core/proxy-group';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/task-group';
import { Empty } from 'antd';
import React from 'react';
import { FixedSizeList } from 'react-window';

interface Props {
    tasks: TaskViewData[];
    proxyGroups: ProxyGroupViewData[];
    profileGroups: ProfileGroupViewData[];
    taskGroup: TaskGroupViewData;
}

const TaskList: React.FunctionComponent<Props> = (props) => {
    const { tasks, profileGroups, proxyGroups, taskGroup } = props;

    // element is a parameter passed by FixedSizeList, it has an index and a style object
    const renderTaskComponent = (element: any) => {
        const { index, style } = element;

        return (
            <Task
                key={tasks[index].id}
                taskGroup={taskGroup}
                task={tasks[index]}
                proxyGroups={proxyGroups}
                profileGroups={profileGroups}
                style={style}
            />
        );
    };

    return tasks.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ fontSize: '20px', fontWeight: 500 }}>Add some tasks ! 🐱‍💻 </span>}
            />
        </div>
    ) : (
        <FixedSizeList height={700} itemCount={tasks.length} itemSize={45} width="100%" style={{ flex: 1, padding: 10 }}>
            {renderTaskComponent}
        </FixedSizeList>
    );
};

export default TaskList;
