import { ProfileGroupViewData } from '@core/profile-group';
import { ProxyGroupViewData } from '@core/proxy-group';
import { TaskViewData } from '@core/task';
import React from 'react';
interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    task: TaskViewData;
    massEdit: boolean;
    proxyGroups: ProxyGroupViewData[];
    profileGroups: ProfileGroupViewData[];
}

const EditTaskModal: React.FunctionComponent<Props> = (props) => {
    return <div>edit task</div>;
};

export default EditTaskModal;
