import { StoreType } from '../constants/stores';
import { debug } from './log';
import { TaskGroup } from './taskgroup';

const log = debug.extend('TaskGroupFactory');

export class TaskGroupFactory {
    constructor() {}

    public createTaskGroup(id: string, name: string, storeType: StoreType): TaskGroup {
        const taskGroup = new TaskGroup(id, name, storeType);
        return taskGroup;
    }
}
