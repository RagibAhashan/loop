import AddTaskAction from '@components/actions/add-task-action';
import DeleteAllTaskAction from '@components/actions/delete-all-tasks-action';
import EditAllTasksAction from '@components/actions/edit-all-tasks-action';
import StartAllTasksAction from '@components/actions/start-all-task-action';
import StopAllTasksAction from '@components/actions/stop-all-tasks-action';
import { ProfileGroupChannel, ProxySetChannel, TaskGroupChannel } from '@core/ipc-channels';
import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { TaskViewData } from '@core/task';
import { TaskGroupViewData } from '@core/taskgroup';
import React, { useEffect, useState } from 'react';
import TaskHeaders from './task-headers';
import TaskList from './task-list';

interface State {
    tasks: TaskViewData[];
    selectedTaskGroup: TaskGroupViewData;
}

const TaskContainer: React.FunctionComponent = () => {
    const [taskContainerState, setTaskContainerState] = useState<State>({ tasks: [], selectedTaskGroup: undefined });

    const [profileGroups, setProfileGroups] = useState<ProfileGroupViewData[]>([]);
    const [proxySets, setProxySets] = useState<ProxySetViewData[]>([]);

    const handleOnTaskGroupSelected = (event, taskGroup: TaskGroupViewData, tasks: TaskViewData[]) => {
        console.log('got task group selectoin', taskGroup, tasks);
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

    const RenderHeaders = () => {
        if (!taskContainerState.selectedTaskGroup) return null;

        return <TaskHeaders />;
    };
    const RenderTasks = () => {
        if (!taskContainerState.selectedTaskGroup) return null;

        return (
            <TaskList
                tasks={taskContainerState.tasks}
                taskGroup={taskContainerState.selectedTaskGroup}
                profileGroups={profileGroups}
                proxySets={proxySets}
            />
        );
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'auto' }}>
                <div>{RenderHeaders()}</div>
                <div>{RenderTasks()}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-evenly' }}>
                <div>
                    <AddTaskAction
                        proxySets={proxySets}
                        profileGroups={profileGroups}
                        taskGroup={taskContainerState.selectedTaskGroup}
                    ></AddTaskAction>
                </div>
                <div>
                    <EditAllTasksAction
                        taskGroup={taskContainerState.selectedTaskGroup}
                        proxySets={proxySets}
                        profileGroups={profileGroups}
                    ></EditAllTasksAction>
                </div>
                <div>
                    <StartAllTasksAction
                        taskGroup={taskContainerState.selectedTaskGroup}
                        areTasksCreated={false}
                        areTasksRunning={false}
                    ></StartAllTasksAction>
                </div>
                <div>
                    <StopAllTasksAction
                        taskGroup={taskContainerState.selectedTaskGroup}
                        areTasksCreated={false}
                        areTasksRunning={false}
                    ></StopAllTasksAction>
                </div>
                <div>
                    <DeleteAllTaskAction tasks={taskContainerState.tasks} taskGroup={taskContainerState.selectedTaskGroup}></DeleteAllTaskAction>
                </div>
                <div>{/* <CaptchaAction></CaptchaAction> */}</div>
            </div>
        </div>
    );
};

export default TaskContainer;
