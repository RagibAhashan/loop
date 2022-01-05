import WalmartTaskContainer from '@components/Walmart/WalmartTaskContainer';
import { StoreType } from '@constants/Stores';
import { ProfileGroupChannel, ProxySetChannel, TaskGroupChannel } from '@core/IpcChannels';
import { ProfileGroupViewData } from '@core/ProfileGroup';
import { ProxySetViewData } from '@core/ProxySet';
import { TaskViewData } from '@core/Task';
import { TaskGroupViewData } from '@core/TaskGroup';
import React, { useEffect, useState } from 'react';

interface State {
    tasks: TaskViewData[];
    selectedTaskGroup: TaskGroupViewData;
}

const TaskContainer: React.FunctionComponent = () => {
    const [taskContainerState, setTaskContainerState] = useState<State>({ tasks: [], selectedTaskGroup: undefined });

    const [profileGroups, setProfileGroups] = useState<ProfileGroupViewData[]>([]);
    const [proxySets, setProxySets] = useState<ProxySetViewData[]>([]);

    const handleOnTaskGroupSelected = (event, taskGroup: TaskGroupViewData, tasks: TaskViewData[]) => {
        setTaskContainerState({
            tasks: tasks,
            selectedTaskGroup: taskGroup,
        });
    };

    const handleTasksUpdated = (event, tasks: TaskViewData[]) => {
        setTaskContainerState((prev) => {
            return { tasks: tasks, selectedTaskGroup: prev.selectedTaskGroup };
        });
    };

    useEffect(() => {
        window.ElectronBridge.on(TaskGroupChannel.onTaskGroupSelected, handleOnTaskGroupSelected);
        window.ElectronBridge.on(TaskGroupChannel.tasksUpdated, handleTasksUpdated);

        window.ElectronBridge.invoke(ProfileGroupChannel.getAllProfileGroups).then((data: ProfileGroupViewData[]) => {
            setProfileGroups(data);
        });

        window.ElectronBridge.invoke(ProxySetChannel.getAllProxySets).then((data: ProxySetViewData[]) => {
            setProxySets(data);
        });

        return () => {
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.onTaskGroupSelected);
            window.ElectronBridge.removeAllListeners(TaskGroupChannel.tasksUpdated);
        };
    }, []);

    const RenderTaskContainer = () => {
        if (!taskContainerState.selectedTaskGroup) return null;

        console.log('rendering task contaienr', taskContainerState.selectedTaskGroup.storeType == StoreType.WalmartCA);
        console.log('rendering task contaienr', taskContainerState.selectedTaskGroup.storeType);
        switch (taskContainerState.selectedTaskGroup.storeType) {
            // case StoreType.FootlockerCA:
            // case StoreType.FootlockerUS:
            //     return (
            //         <FootlockerTaskContainer
            //             profileGroups={profileGroups}
            //             proxySets={proxySets}
            //             taskGroup={taskContainerState.selectedTaskGroup}
            //             tasks={taskContainerState.tasks}
            //         />
            //     );
            case StoreType.WalmartCA:
            case StoreType.WalmartUS:
                console.log('rednering walmart task container');
                return (
                    <WalmartTaskContainer
                        profileGroups={profileGroups}
                        proxySets={proxySets}
                        taskGroup={taskContainerState.selectedTaskGroup}
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
