import FootlockerTaskContainer from '@components/Footlocker/FootlockerTaskContainer';
import WalmartTaskContainer from '@components/Walmart/WalmartTaskContainer';
import { StoreType } from '@constants/Stores';
import { ProfileChannel, ProxySetChannel, TaskGroupChannel } from '@core/IpcChannels';
import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { ITask } from '@core/Task';
import { ITaskGroup } from '@core/TaskGroup';
import React, { useEffect, useState } from 'react';

const TaskContainer: React.FunctionComponent = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [currentSelectedTaskGroup, setCurrentSelectedTaskGroup] = useState<ITaskGroup>();

    const [profiles, setProfiles] = useState<IProfile[]>([]);
    const [proxySets, setProxySets] = useState<IProxySet[]>([]);

    useEffect(() => {
        window.ElectronBridge.on(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);
        window.ElectronBridge.on(TaskGroupChannel.tasksUpdated, handleTasksUpdated);

        window.ElectronBridge.invoke(ProfileChannel.getAllProfiles).then((data: IProfile[]) => {
            setProfiles(data);
        });

        window.ElectronBridge.invoke(ProxySetChannel.getAllProxySets).then((data: IProxySet[]) => {
            setProxySets(data);
        });

        return () => {
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.onTaskGroupSelected);
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.tasksUpdated);
        };
    }, []);

    const handleOnTaskGroupSelected = (event, taskGroup: ITaskGroup, tasks: ITask[]) => {
        setCurrentSelectedTaskGroup(taskGroup);
        setTasks(tasks);
    };

    const handleTasksUpdated = (event, tasks: ITask[]) => {
        setTasks(tasks);
    };

    const RenderTaskContainer = () => {
        if (!currentSelectedTaskGroup) return null;

        switch (currentSelectedTaskGroup.storeType) {
            case StoreType.FootlockerCA:
            case StoreType.FootlockerUS:
                return <FootlockerTaskContainer profiles={profiles} proxySets={proxySets} taskGroup={currentSelectedTaskGroup} tasks={tasks} />;
            case StoreType.WalmartCA:
            case StoreType.WalmartUS:
                return <WalmartTaskContainer profiles={profiles} proxySets={proxySets} taskGroup={currentSelectedTaskGroup} tasks={tasks} />;
            default:
                return null;
        }
    };

    return <div style={{ width: '100%', height: '100%' }}>{RenderTaskContainer()}</div>;
};

export default TaskContainer;
