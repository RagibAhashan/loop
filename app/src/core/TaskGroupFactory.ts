import { StoreType } from '../constants/Stores';
import { debug } from './Log';
import { TaskGroup } from './TaskGroup';

const log = debug.extend('TaskGroupFactory');

export class TaskGroupFactory {
    constructor() {}

    public createTaskGroup(id: string, name: string, storeType: StoreType): TaskGroup {
        const taskGroup = new TaskGroup(id, name, storeType);
        return taskGroup;
    }
}
