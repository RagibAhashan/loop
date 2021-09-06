import { Empty } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { NOTIFY_TASK_STATUS } from '../../common/Constants';
import { StoreType } from '../../constants/Stores';
import { AppState } from '../../global-store/GlobalStore';
import { Status } from '../../interfaces/TaskInterfaces';
import { getTasksByStore } from '../../services/Store/StoreService';
const { ipcRenderer } = window.require('electron');

const TaskListContainer = (props: any) => {
    const { storeKey, TaskComponent }: { storeKey: StoreType; TaskComponent: React.ComponentType<any> } = props;

    const tasks = useSelector((state: AppState) => getTasksByStore(state, storeKey));
    const tasksArray = Object.values(tasks);

    useEffect(() => {
        ipcRenderer.on(NOTIFY_TASK_STATUS(storeKey), (event, uuid: string, status: Status) => {
            localStorage.setItem(uuid, JSON.stringify(status));
        });

        return () => {
            ipcRenderer.removeAllListeners(NOTIFY_TASK_STATUS(storeKey));
        };
    }, [storeKey]);

    // element is a parameter passed by FixedSizeList, it has an index and a style object
    const renderTaskComponent = (element: any) => {
        const { index, style } = element;

        return <TaskComponent key={tasksArray[index].uuid} storeKey={storeKey} uuid={tasksArray[index].uuid} style={style} />;
    };

    return Object.keys(tasks).length === 0 ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ fontSize: '20px', fontWeight: 500 }}>Add some tasks ! 🐱‍💻 </span>}
            />
        </div>
    ) : (
        <FixedSizeList height={700} itemCount={Object.keys(tasks).length} itemSize={45} width="100%" style={{ flex: 1, padding: 10 }}>
            {renderTaskComponent}
        </FixedSizeList>
    );
};

export default TaskListContainer;
