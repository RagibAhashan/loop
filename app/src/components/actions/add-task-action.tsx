import { TaskGroupChannel } from '@core/ipc-channels';
import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { TaskFormData } from '@core/task';
import { TaskGroupViewData } from '@core/taskgroup';
import { Button } from 'antd';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { buttonStyle } from '../../styles/Buttons';

export interface TaskFormValues {
    profileName: string;
    retryDelay: number;
    proxySetName: string;
    quantity: number;
}

export interface NewTaskModalProps {
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    onAdd: (data: TaskFormData, quantity: number) => void;
}

interface Props {
    NewTaskModalComponent: React.ComponentType<NewTaskModalProps>;
    taskGroup: TaskGroupViewData;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
}
// This component will contain the add task button and task modal composition
const AddTaskAction: React.FunctionComponent<Props> = (props) => {
    const { NewTaskModalComponent, taskGroup, proxySets, profileGroups } = props;

    const [isOpen, setOpen] = useState(false);

    const handleAddTask = (task: TaskFormData, quantity: number) => {
        const taskArr: TaskFormData[] = [];
        for (let i = 0; i < quantity; i++) {
            const newTask = { ...task, uuid: uuid() };
            taskArr.push(newTask);
        }

        window.ElectronBridge.send(TaskGroupChannel.addTaskToGroup, taskGroup.name, taskArr);

        setOpen(false);
    };

    return (
        <div>
            <Button style={buttonStyle} type="primary" onClick={() => setOpen(true)}>
                Add Task
            </Button>

            <NewTaskModalComponent
                proxySets={proxySets}
                profileGroups={profileGroups}
                onAdd={handleAddTask}
                isOpen={isOpen}
                setOpen={setOpen}
            ></NewTaskModalComponent>
        </div>
    );
};

export default AddTaskAction;
