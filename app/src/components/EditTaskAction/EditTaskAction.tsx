import { EditFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIFY_EDIT_TASK } from '../../common/Constants';
import { StoreType } from '../../constants/Stores';
import { AppState } from '../../global-store/GlobalStore';
import { editTask, getTaskById } from '../../services/Store/StoreService';
import { editButton } from '../../styles/Buttons';

const EditTaskAction = (props: any) => {
    const { storeKey, uuid, EditTaskModalComponent }: { storeKey: StoreType; uuid: string; EditTaskModalComponent: any; editAll: boolean } = props;

    const dispatch = useDispatch();
    const [visibleModal, setVisibleModal] = useState(false);

    const currentTask = useSelector((state: AppState) => getTaskById(state, storeKey, uuid));
    const isTaskRunning = currentTask.running;

    const onEditClick = () => {
        setVisibleModal(true);
    };

    const onModalClose = () => {
        setVisibleModal(false);
    };

    const handleEditTask = (newValues: any) => {
        dispatch(editTask({ storeKey: storeKey, uuid: uuid, newValue: newValues }));
        window.ElectronBridge.send(NOTIFY_EDIT_TASK(storeKey), uuid, { ...currentTask, ...newValues });

        setVisibleModal(false);
    };
    return (
        <div>
            <Button onClick={onEditClick} style={editButton} size="small" icon={<EditFilled />} disabled={isTaskRunning} />

            <EditTaskModalComponent visible={visibleModal} onClose={onModalClose} onEdit={handleEditTask} task={currentTask} />
        </div>
    );
};

export default EditTaskAction;
