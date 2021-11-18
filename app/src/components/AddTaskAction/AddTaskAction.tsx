import { TaskGroupChannel } from '@core/IpcChannels';
import { TaskGroup } from '@core/TaskGroup';
import { Button } from 'antd';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { TaskData } from '../../interfaces/TaskInterfaces';
import { buttonStyle } from '../../styles/Buttons';
interface Props {
    NewTaskModalComponent: React.ComponentType<any>;
    taskGroup: TaskGroup;
}
// This component will contain the add task button and task modal composition
const AddTaskAction: React.FunctionComponent<Props> = (props) => {
    const [showModal, setShowModal] = useState(false);

    const { NewTaskModalComponent, taskGroup } = props;

    const handleAddTask = (task: TaskData, quantity: number) => {
        const taskArr: TaskData[] = [];
        for (let i = 0; i < quantity; i++) {
            const newTask = { ...task, uuid: uuid() };
            taskArr.push(newTask);
        }

        console.log('adding task to ', taskGroup, taskGroup.name, taskGroup.tasks);
        window.ElectronBridge.send(TaskGroupChannel.addTaskToGroup, taskGroup.name, taskArr);
    };

    return (
        <div>
            <Button style={buttonStyle} type="primary" onClick={() => setShowModal(true)}>
                Add Task
            </Button>

            <NewTaskModalComponent showModal={showModal} setShowModal={setShowModal} onAdd={handleAddTask}></NewTaskModalComponent>
        </div>
    );
};

export default AddTaskAction;
