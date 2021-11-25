import FootlockerTaskContainer from '@components/Footlocker/FootlockerTaskContainer';
import WalmartTaskContainer from '@components/Walmart/WalmartTaskContainer';
import { StoreType } from '@constants/Stores';
import { ProfileChannel, ProxySetChannel, TaskGroupChannel } from '@core/IpcChannels';
import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { ITask } from '@core/Task';
import { ITaskGroup } from '@core/TaskGroup';
import React, { useEffect, useState } from 'react';

interface State {
    tasks: ITask[];
    currentSelectedTaskGroup: ITaskGroup;
}

const TaskContainer: React.FunctionComponent = () => {
    const [taskContainerState, setTaskContainerState] = useState<State>({ tasks: [], currentSelectedTaskGroup: undefined });

    const [profiles, setProfiles] = useState<IProfile[]>([]);
    const [proxySets, setProxySets] = useState<IProxySet[]>([]);

    const handleOnTaskGroupSelected = (event, taskGroup: ITaskGroup, tasks: ITask[]) => {
        // TODO : The state ordering here is important, if we put setCurrentSelectedTaskGroup, it will rerenreder with the old tasks and throw errors

        setTaskContainerState({
            tasks: tasks,
            currentSelectedTaskGroup: taskGroup,
        });
    };

    const handleTasksUpdated = (event, tasks: ITask[]) => {
        setTaskContainerState((prev) => {
            return { tasks: tasks, currentSelectedTaskGroup: prev.currentSelectedTaskGroup };
        });
    };

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

    const RenderTaskContainer = () => {
        if (!taskContainerState.currentSelectedTaskGroup) return null;
        switch (taskContainerState.currentSelectedTaskGroup.storeType) {
            case StoreType.FootlockerCA:
            case StoreType.FootlockerUS:
                return (
                    <FootlockerTaskContainer
                        profiles={profiles}
                        proxySets={proxySets}
                        taskGroup={taskContainerState.currentSelectedTaskGroup}
                        tasks={taskContainerState.tasks}
                    />
                );
            case StoreType.WalmartCA:
            case StoreType.WalmartUS:
                return (
                    <WalmartTaskContainer
                        profiles={profiles}
                        proxySets={proxySets}
                        taskGroup={taskContainerState.currentSelectedTaskGroup}
                        tasks={taskContainerState.tasks}
                    />
                );
            default:
                return null;
        }
    };

    return <div style={{ width: '100%', height: '100%' }}>{RenderTaskContainer()}</div>;
};

export default TaskContainer;
