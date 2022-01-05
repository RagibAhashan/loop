import { useDisclosure } from '@chakra-ui/react';
import { TaskGroupChannel } from '@core/IpcChannels';
import { ProfileGroupViewData } from '@core/ProfileGroup';
import { ProxySetViewData } from '@core/ProxySet';
import { TaskFormData } from '@core/Task';
import { TaskGroupViewData } from '@core/TaskGroup';
import { Button } from 'antd';
import React from 'react';
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
    onClose: () => void;
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
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { NewTaskModalComponent, taskGroup, proxySets, profileGroups } = props;

    const handleAddTask = (task: TaskFormData, quantity: number) => {
        const taskArr: TaskFormData[] = [];
        for (let i = 0; i < quantity; i++) {
            const newTask = { ...task, uuid: uuid() };
            taskArr.push(newTask);
        }

        window.ElectronBridge.send(TaskGroupChannel.addTaskToGroup, taskGroup.name, taskArr);

        onClose();
    };

    return (
        <div>
            <Button style={buttonStyle} type="primary" onClick={onOpen}>
                Add Task
            </Button>

            <NewTaskModalComponent
                proxySets={proxySets}
                profileGroups={profileGroups}
                onAdd={handleAddTask}
                isOpen={isOpen}
                onClose={onClose}
            ></NewTaskModalComponent>
        </div>
    );
};

export default AddTaskAction;
