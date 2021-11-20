import { IProfile } from '@core/Profile';
import { IProxySet } from '@core/ProxySet';
import { ITaskGroup } from '@core/TaskGroup';
import { Button } from 'antd';
import React, { useState } from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    EditTaskModalComponent: React.ComponentType<any>;
    taskGroup: ITaskGroup;
    proxySets: IProxySet[];
    profiles: IProfile[];
}

const EditAllTasksAction: React.FunctionComponent<Props> = (props) => {
    const { EditTaskModalComponent, proxySets, profiles } = props;

    const [showModal, setShowModal] = useState(false);

    // const areTasksRunning = store.running;
    // const noTaskCreated = Object.keys(tasks).length === 0;

    const onEditClick = () => {
        setShowModal(true);
    };

    const handleEditTask = (newValues: any) => {
        // the dispatch is located in the editAllTasks reducer
        // dispatch(editAllTasks({ storeKey, newValue: newValues }));

        // TODO editall proxy reassignment

        setShowModal(false);
    };

    return (
        <div>
            <Button style={buttonStyle} type="primary" onClick={onEditClick}>
                Edit All
            </Button>
            <EditTaskModalComponent showModal={showModal} massEdit={true} setShowModal={setShowModal} task={{}} />
        </div>
    );
};

export default EditAllTasksAction;
