import { Button } from 'antd';
import React, { useState } from 'react';
import { TaskData } from '../../interfaces/TaskInterfaces';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    NewTaskModalComponent: React.ComponentType<any>;
}
// This component will contain the add task button and task modal composition
const AddTaskAction: React.FunctionComponent<Props> = (props) => {
    const [showModal, setShowModal] = useState(false);

    const { NewTaskModalComponent } = props;

    const handleAddTask = (task: TaskData, quantity: number) => {
        // const taskArr: TaskData[] = [];
        // const taskIDArr: string[] = [];
        // for (let i = 0; i < quantity; i++) {
        //     let newTask = { ...task, uuid: uuid(), running: false, status: { level: 'idle' as StatusLevel, message: 'Idle' } };
        //     if (!task.proxySet) newTask = { ...newTask, proxy: null };
        //     taskArr.push(newTask);
        //     taskIDArr.push(newTask.uuid);
        // }
        // if (task.proxySet) dispatch(assignRandomProxy(task.proxySet, storeKey, taskIDArr));
        // dispatch(addTask({ storeKey: storeKey, tasks: taskArr }));
        // window.ElectronBridge.send(NOTIFY_ADD_TASK(storeKey), taskArr);
        // setVisibleModal(false);
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
