import { ProfileGroupViewData } from '@core/profilegroup';
import { ProxySetViewData } from '@core/proxyset';
import { TaskViewData } from '@core/task';
import React from 'react';
interface Props {
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    task: TaskViewData;
    massEdit: boolean;
    proxySets: ProxySetViewData[];
    profileGroups: ProfileGroupViewData[];
}

const EditTaskModal: React.FunctionComponent<Props> = (props) => {
    return <div>edit task</div>;
};

export default EditTaskModal;
