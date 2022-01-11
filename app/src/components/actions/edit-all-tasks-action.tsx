import EditTaskModal from '@components/task/edit-task-modal';
import { ProfileGroupViewData } from '@core/profile-group';
import { ProxyGroupViewData } from '@core/proxy-group';
import { TaskGroupViewData } from '@core/task-group';
import { Button } from 'antd';
import React, { useState } from 'react';
import { buttonStyle } from '../../styles/Buttons';

interface Props {
    taskGroup: TaskGroupViewData | undefined;
    proxyGroups: ProxyGroupViewData[];
    profileGroups: ProfileGroupViewData[];
}

const EditAllTasksAction: React.FunctionComponent<Props> = (props) => {
    const { proxyGroups, profileGroups, taskGroup } = props;

    const [isOpen, setOpen] = useState(false);

    // const areTasksRunning = store.running;
    // const noTaskCreated = Object.keys(tasks).length === 0;

    const onEditClick = () => {
        setOpen(true);
    };

    const handleEditTask = (newValues: any) => {
        // the dispatch is located in the editAllTasks reducer
        // dispatch(editAllTasks({ storeKey, newValue: newValues }));

        // TODO editall proxy reassignment

        setOpen(false);
    };

    return (
        <div>
            <Button style={buttonStyle} type="primary" onClick={onEditClick} disabled={!taskGroup}>
                Edit All
            </Button>

            {!!taskGroup ?? (
                <EditTaskModal
                    proxyGroups={proxyGroups}
                    profileGroups={profileGroups}
                    setOpen={setOpen}
                    massEdit={true}
                    isOpen={isOpen}
                    task={{} as any}
                />
            )}
        </div>
    );
};

export default EditAllTasksAction;
