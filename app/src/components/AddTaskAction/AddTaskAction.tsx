import { Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { StoreType } from '../../constants/Stores';
import { StatusLevel, TaskData } from '../../interfaces/TaskInterfaces';
import { assignRandomProxy } from '../../services/Proxy/ProxyService';
import { addTask } from '../../services/Store/StoreService';
import { buttonStyle } from '../../styles/Buttons';
const { v4: uuid } = require('uuid');

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

        dispatch(addTask({ storeKey: storeKey, tasks: taskArr }));
        if (task.proxySet) dispatch(assignRandomProxy(task.proxySet, storeKey, taskIDArr));

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
