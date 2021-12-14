import { StoreType } from '../constants/Stores';
import { debug } from './Log';
import { TaskGroup } from './TaskGroup';

const log = debug.extend('TaskGroupFactory');

export class TaskGroupFactory {
    constructor() {}

    public createTaskGroup(name: string, storeType: StoreType): TaskGroup {
        const taskGroup = new TaskGroup(name, storeType);
        return taskGroup;
    }
}
