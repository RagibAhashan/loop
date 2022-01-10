import { NewTaskModal, TaskFormValues } from '@components/task/add-task-modal';
import { AccountGroupViewData } from '@core/account-group';
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
    taskGroup: TaskGroupViewData | undefined;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
    accountGroups: AccountGroupViewData[];
}
// This component will contain the add task button and task modal composition
const AddTaskAction: React.FunctionComponent<Props> = (props) => {
    const { taskGroup, proxySets, profileGroups, accountGroups } = props;

    const [isOpen, setOpen] = useState(false);

    const handleAddTask = (task: TaskFormValues, quantity: number) => {
        if (!taskGroup) return;

        const taskArr: TaskFormData[] = [];
        for (let i = 0; i < quantity; i++) {
            const newTask: TaskFormData = {
                id: generateId(taskPrefix),
                productIdentifier: task.productIdentifier,
                productQuantity: task.productQuantity,
                proxySetId: task.proxySetId,
                retryDelay: task.retryDelay,
                account: task.account ? { groupId: task.account.split(':')[0], id: task.account.split(':')[1] } : null,
                profile: { groupId: task.profile.split(':')[0], id: task.profile.split(':')[1] },
            };

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
                    accountGroups={accountGroups}
                    onAdd={handleAddTask}
                    isOpen={isOpen}
                    setOpen={setOpen}
                ></NewTaskModal>
            )}
        </div>
    );
};

export default AddTaskAction;
