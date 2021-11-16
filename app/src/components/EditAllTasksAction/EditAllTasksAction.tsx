import { StoreType } from '@constants/Stores';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../global-store/GlobalStore';
import { editAllTasks, getStoreById, getTasksByStore } from '../../services/Store/StoreService';
import { buttonStyle } from '../../styles/Buttons';

const EditAllTasksAction = (props: any) => {
    const { storeKey, EditTaskModalComponent }: { storeKey: StoreType; EditTaskModalComponent: any } = props;

    const [visibleModal, setVisibleModal] = useState(false);
    const dispatch = useDispatch();

    const tasks = useSelector((state: AppState) => getTasksByStore(state, storeKey));
    const store = useSelector((state: AppState) => getStoreById(state, storeKey));

    const areTasksRunning = store.running;
    const noTaskCreated = Object.keys(tasks).length === 0;

    const onEditClick = () => {
        setVisibleModal(true);
    };

    const onModalClose = () => {
        setVisibleModal(false);
    };

    const handleEditTask = (newValues: any) => {
        // the dispatch is located in the editAllTasks reducer
        dispatch(editAllTasks({ storeKey, newValue: newValues }));

        // TODO editall proxy reassignment

        setVisibleModal(false);
    };

    return (
        <div>
            <Button style={buttonStyle} type="primary" onClick={onEditClick} disabled={noTaskCreated || areTasksRunning}>
                Edit All
            </Button>
            <EditTaskModalComponent visible={visibleModal} onClose={onModalClose} onEdit={handleEditTask} task={{}} />
        </div>
    );
};

export default EditAllTasksAction;
