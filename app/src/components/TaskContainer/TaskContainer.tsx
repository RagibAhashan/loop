import FootlockerTaskContainer from '@components/Footlocker/FootlockerTaskContainer';
import WalmartTaskContainer from '@components/Walmart/WalmartTaskContainer';
import { StoreType } from '@constants/Stores';
import { TaskGroupChannel } from '@core/IpcChannels';
import { Task } from '@core/Task';
import { TaskGroup } from '@core/TaskGroup';
import React, { useEffect, useState } from 'react';

const RenderTaskContainer = (taskGroup: TaskGroup, tasks: Task[]) => {
    switch (taskGroup.storeType) {
        case StoreType.FootlockerCA:
        case StoreType.FootlockerUS:
            return <FootlockerTaskContainer taskGroup={taskGroup} tasks={tasks} />;
        case StoreType.WalmartCA:
        case StoreType.WalmartUS:
            return <WalmartTaskContainer taskGroup={taskGroup} tasks={tasks} />;
        default:
            return null;
    }
};

const TaskContainer: React.FunctionComponent = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentSelectedTaskGroup, setCurrentSelectedTaskGroup] = useState<TaskGroup>();

    useEffect(() => {
        window.ElectronBridge.on(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);

        return () => {
            window.ElectronBridge.removeListener(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);
        };
    }, []);

    const handleOnTaskGroupSelected = (event, taskGroup: TaskGroup, tasks: Task[]) => {
        setCurrentSelectedTaskGroup(taskGroup);
        setTasks(tasks);
    };

    return <div>{RenderTaskContainer(currentSelectedTaskGroup, tasks)}</div>;
};

export default TaskContainer;
