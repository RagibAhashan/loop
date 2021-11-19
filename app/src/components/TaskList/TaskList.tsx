import { ITask } from '@core/Task';
import { Empty } from 'antd';
import React from 'react';
import { FixedSizeList } from 'react-window';

interface Props {
    tasks: ITask[];
    TaskComponent: React.ComponentType<any>;
}

const TaskList: React.FunctionComponent<Props> = (props) => {
    const { tasks, TaskComponent } = props;

    // useEffect(() => {
    //     window.ElectronBridge.on(NOTIFY_TASK_STATUS(storeKey), (event, uuid: string, status: Status) => {
    //         localStorage.setItem(uuid, JSON.stringify(status));
    //     });

    //     return () => {
    //         window.ElectronBridge.removeAllListeners(NOTIFY_TASK_STATUS(storeKey));
    //     };
    // }, []);

    // element is a parameter passed by FixedSizeList, it has an index and a style object
    const renderTaskComponent = (element: any) => {
        const { index, style } = element;

        return <TaskComponent key={tasks[index].taskData.uuid} task={tasks[index]} style={style} />;
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
