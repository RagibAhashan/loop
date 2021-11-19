import FootlockerTaskContainer from '@components/Footlocker/FootlockerTaskContainer';
import WalmartTaskContainer from '@components/Walmart/WalmartTaskContainer';
import { StoreType } from '@constants/Stores';
import { ProfileChannel, ProxySetChannel, TaskGroupChannel } from '@core/IpcChannels';
import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { Task } from '@core/Task';
import { ITaskGroup } from '@core/TaskGroup';
import React, { useEffect, useState } from 'react';

const TaskContainer: React.FunctionComponent = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentSelectedTaskGroup, setCurrentSelectedTaskGroup] = useState<ITaskGroup>();

    const [profiles, setProfiles] = useState<IProfile[]>([]);
    const [proxySets, setProxySets] = useState<IProxySet[]>([]);

    useEffect(() => {
        window.ElectronBridge.on(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);

        window.ElectronBridge.invoke(ProfileChannel.getAllProfiles).then((data: IProfile[]) => {
            setProfiles(data);
        });

        window.ElectronBridge.invoke(ProxySetChannel.getAllProxySets).then((data: IProxySet[]) => {
            setProxySets(data);
        });

        return () => {
            window.ElectronBridge.removeListener(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);
        };
    }, []);

    const handleOnTaskGroupSelected = (event, taskGroup: ITaskGroup, tasks: Task[]) => {
        setCurrentSelectedTaskGroup(taskGroup);
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

    return <div>{RenderTaskContainer()}</div>;
};

export default TaskContainer;
