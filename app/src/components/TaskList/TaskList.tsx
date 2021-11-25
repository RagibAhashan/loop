import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { ITask } from '@core/Task';
import { Empty } from 'antd';
import React from 'react';
import { FixedSizeList } from 'react-window';

interface TaskComponentProps {
    task: ITask;
    style: any;
    proxySets: IProxySet[];
    profiles: IProfile[];
    groupName: string;
}
interface Props {
    tasks: ITask[];
    proxySets: IProxySet[];
    profiles: IProfile[];
    groupName: string;
    TaskComponent: React.ComponentType<TaskComponentProps>;
}

const TaskList: React.FunctionComponent<Props> = (props) => {
    const { tasks, TaskComponent, profiles, proxySets, groupName } = props;

    // element is a parameter passed by FixedSizeList, it has an index and a style object
    const renderTaskComponent = (element: any) => {
        const { index, style } = element;

        return (
            <TaskComponent
                key={tasks[index].taskData.uuid}
                groupName={groupName}
                task={tasks[index]}
                proxySets={proxySets}
                profiles={profiles}
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
