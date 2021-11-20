import { EditFilled } from '@ant-design/icons';
import { ITask } from '@core/Task';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { editButton } from '../../styles/Buttons';

interface Props {
    EditTaskModalComponent: React.ComponentType<any>;
    task: ITask;
}
const EditTaskAction: React.FunctionComponent<Props> = (props) => {
    const { EditTaskModalComponent, task } = props;

    const [showModal, setShowModal] = useState(false);

    // const isTaskRunning = currentTask.running;

    const onEditClick = () => {
        setShowModal(true);
    };

    useEffect(() => {
        console.log('editing current task', task);
    }, []);

    // const onModalClose = () => {
    //     setVisibleModal(false);
    // };

    const handleEditTask = (newValues: any) => {
        // console.log('new values ', newValues);
        // dispatch(editTask({ storeKey: storeKey, uuid: uuid, newValue: newValues }));
        // // after editing the task, check if proxy was modified and assign a random proxy
        // if (newValues.proxySet != null && currentTask.proxySet != newValues.proxySet) {
        //     console.log('assigning randome values');
        //     dispatch(assignRandomProxy(newValues.proxySet, storeKey, [uuid]));
        // } else if (newValues.proxySet == null) {
        //     console.log('unassigning proxy after null');
        //     // dispatch(unassignProxy({ name: currentTask.proxySet, proxy: currentTask.proxy, taskID: currentTask.uuid }));
        // }

        // window.ElectronBridge.send(NOTIFY_EDIT_TASK(storeKey), uuid, { ...currentTask, ...newValues });

        setShowModal(false);
    };
    return (
        <div>
            <Button onClick={onEditClick} style={editButton} size="small" icon={<EditFilled />} />

            <EditTaskModalComponent massEdit={false} showModal={showModal} setShowModal={setShowModal} onEdit={handleEditTask} task={task} />
        </div>
    );
};

export default EditTaskAction;
