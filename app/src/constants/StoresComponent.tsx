import FLEditTaskModal from '../components/Footlocker/FLEditTaskModal';
import FLNewTaskModal from '../components/Footlocker/FLNewTaskModal';
import FLTask from '../components/Footlocker/FLTask';
import { StoreType } from './Stores';

/*
This file contains a mapping of store and contained components
*/
export interface StoreComponent {
    TaskComponent: JSX.Element;
    NewTaskModalComponent: JSX.Element;
    EditTaskModalComponent: JSX.Element;
}

export type StoresComponentMap = { readonly [key in StoreType]: StoreComponent };

export const STORES_COMPONENT: StoresComponentMap = {
    FootlockerUS: {
        TaskComponent: <FLTask />,
        NewTaskModalComponent: <FLNewTaskModal />,
        EditTaskModalComponent: <FLEditTaskModal />,
    },
    FootlockerCA: {
        TaskComponent: <FLTask />,
        NewTaskModalComponent: <FLNewTaskModal />,
        EditTaskModalComponent: <FLEditTaskModal />,
    },
    WalmartUS: { TaskComponent: <FLTask />, NewTaskModalComponent: <FLNewTaskModal />, EditTaskModalComponent: <FLEditTaskModal /> },
    WalmartCA: { TaskComponent: <FLTask />, NewTaskModalComponent: <FLNewTaskModal />, EditTaskModalComponent: <FLEditTaskModal /> },
};
