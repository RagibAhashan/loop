import FootlockerTaskContainer from '@components/Footlocker/FootlockerTaskContainer';
import WalmartTaskContainer from '@components/Walmart/WalmartTaskContainer';
import { StoreType } from '@constants/Stores';
import { TaskGroupChannel } from '@core/IpcChannels';
import { Task } from '@core/Task';
import React, { useEffect, useState } from 'react';

const RenderTaskContainer = (storeType: StoreType, tasks: Task[]) => {
    switch (storeType) {
        case StoreType.FootlockerCA:
        case StoreType.FootlockerUS:
            return <FootlockerTaskContainer tasks={tasks} />;
        case StoreType.WalmartCA:
        case StoreType.WalmartUS:
            return <WalmartTaskContainer tasks={tasks} />;
        default:
            return null;
    }
};

const TaskContainer: React.FunctionComponent = () => {
    const [tasks, setTasks] = useState([]);
    const [storeType, setStoreType] = useState();

    useEffect(() => {
        window.ElectronBridge.on(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);

        return () => {
            window.ElectronBridge.removeListener(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);
        };
    }, []);

    const handleOnTaskGroupSelected = (event, storeType, tasks: Task[]) => {
        setStoreType(storeType);
        setTasks(tasks);
    };

    return <div>{RenderTaskContainer(storeType, tasks)}</div>;
};

export default TaskContainer;
