import { StoreType } from '../constants/Stores';
import { debug } from './Log';
import { ProfileManager } from './ProfileManager';
import { ProxySetManager } from './ProxySetManager';
import { TaskFactory } from './TaskFactory';
import { TaskGroup } from './TaskGroup';

const log = debug.extend('TaskGroupFactory');

export class TaskGroupFactory {
    private taskFactory: TaskFactory;

    constructor(profileManager: ProfileManager, proxyManager: ProxySetManager) {
        this.taskFactory = new TaskFactory(profileManager, proxyManager);
    }

    public createTaskGroup(name: string, storeType: StoreType): TaskGroup {
        const taskGroup = new TaskGroup(name, storeType, this.taskFactory);
        return taskGroup;
    }
}
