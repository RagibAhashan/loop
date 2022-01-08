import { NewTaskModal, TaskFormValues } from '@components/task/add-task-modal';
import { generateId } from '@core/helpers';
import { TaskGroupChannel } from '@core/ipc-channels';
import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { TaskFormData, taskPrefix } from '@core/task';
import { TaskGroupViewData } from '@core/taskgroup';
import { Button } from 'antd';
import React, { useState } from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    taskGroup: TaskGroupViewData;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
}
// This component will contain the add task button and task modal composition
const AddTaskAction: React.FunctionComponent<Props> = (props) => {
    const { taskGroup, proxySets, profileGroups } = props;

    const [isOpen, setOpen] = useState(false);

    const handleAddTask = (task: TaskFormValues, quantity: number) => {
        const taskArr: TaskFormData[] = [];
        for (let i = 0; i < quantity; i++) {
            const newTask: TaskFormData = { ...task, id: generateId(taskPrefix) };
            taskArr.push(newTask);
        }

        window.ElectronBridge.send(TaskGroupChannel.addTaskToGroup, taskGroup.id, taskArr);

        setOpen(false);
    };

    return (
        <div>
            <Button style={buttonStyle} type="primary" onClick={() => setOpen(true)} disabled={!taskGroup}>
                Add Task
            </Button>
            {!!taskGroup && (
                <NewTaskModal
                    proxySets={proxySets}
                    profileGroups={profileGroups}
                    onAdd={handleAddTask}
                    isOpen={isOpen}
                    setOpen={setOpen}
                ></NewTaskModal>
            )}
        </div>
    );
};

export default AddTaskAction;
