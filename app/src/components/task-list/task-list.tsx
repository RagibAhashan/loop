import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { TaskViewData } from '@core/task';
import { Empty } from 'antd';
import React from 'react';
import { FixedSizeList } from 'react-window';

interface TaskComponentProps {
    task: TaskViewData;
    style: any;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    groupName: string;
}

interface Props {
    tasks: TaskViewData[];
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    groupName: string;
    TaskComponent: React.ComponentType<TaskComponentProps>;
}

const TaskList: React.FunctionComponent<Props> = (props) => {
    const { tasks, TaskComponent, profileGroups, proxySets, groupName } = props;

    // element is a parameter passed by FixedSizeList, it has an index and a style object
    const renderTaskComponent = (element: any) => {
        const { index, style } = element;

        return (
            <TaskComponent
                key={tasks[index].uuid}
                groupName={groupName}
                task={tasks[index]}
                proxySets={proxySets}
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
