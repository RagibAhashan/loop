import { Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { NOTIFY_ADD_TASK } from '../../common/Constants';
import { StoreType } from '../../constants/Stores';
import { StatusLevel, TaskData } from '../../interfaces/TaskInterfaces';
import { assignRandomProxy } from '../../services/Proxy/ProxyService';
import { addTask } from '../../services/Store/StoreService';
import { buttonStyle } from '../../styles/Buttons';

// This component will contain the add task button and task modal composition
const AddTaskAction = (props: any) => {
    const { storeKey, NewTaskModalComponent }: { storeKey: StoreType; NewTaskModalComponent: any } = props;

    const [visibleModal, setVisibleModal] = useState(false);

    const dispatch = useDispatch();

    const onModalClose = () => {
        setVisibleModal(false);
    };

    const handleAddTask = (task: TaskData, quantity: number) => {
        const taskArr: TaskData[] = [];
        const taskIDArr: string[] = [];

        for (let i = 0; i < quantity; i++) {
            let newTask = { ...task, uuid: uuid(), running: false, status: { level: 'idle' as StatusLevel, message: 'Idle' } };
            if (!task.proxySet) newTask = { ...newTask, proxy: null };

            taskArr.push(newTask);
            taskIDArr.push(newTask.uuid);
        }

        if (task.proxySet) dispatch(assignRandomProxy(task.proxySet, storeKey, taskIDArr));

        dispatch(addTask({ storeKey: storeKey, tasks: taskArr }));
        window.ElectronBridge.send(NOTIFY_ADD_TASK(storeKey), taskArr);

        setVisibleModal(false);
    };

    return (
        <div>
            <Button style={buttonStyle} type="primary" onClick={() => setVisibleModal(true)}>
                Add Task
            </Button>

            <NewTaskModalComponent visible={visibleModal} onClose={onModalClose} onAdd={handleAddTask}></NewTaskModalComponent>
        </div>
    );
};

export default AddTaskAction;
