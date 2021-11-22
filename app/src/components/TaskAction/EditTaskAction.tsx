import { EditFilled } from '@ant-design/icons';
import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { ITask } from '@core/Task';
import { Button } from 'antd';
import React, { useState } from 'react';
import { editButton } from '../../styles/Buttons';

interface Props {
    EditTaskModalComponent: React.ComponentType<any>;
    task: ITask;
    proxySets: IProxySet[];
    profiles: IProfile[];
}
const EditTaskAction: React.FunctionComponent<Props> = (props) => {
    const { EditTaskModalComponent, task, proxySets, profiles } = props;

    const [showModal, setShowModal] = useState(false);

    // const isTaskRunning = currentTask.running;

    const onEditClick = () => {
        setShowModal(true);
    };

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

            <EditTaskModalComponent
                profiles={profiles}
                proxySets={proxySets}
                massEdit={false}
                showModal={showModal}
                setShowModal={setShowModal}
                onEdit={handleEditTask}
                task={task}
            />
        </div>
    );
};

export default EditTaskAction;
