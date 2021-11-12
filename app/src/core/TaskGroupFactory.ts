import { StoreType } from '../constants/Stores';
import { debug } from './Log';
import { TaskGroup } from './TaskGroup';

const log = debug.extend('TaskGroupFactory');
export type TaskGroupMap = Map<string, TaskGroup>;

export class TaskGroupFactory {
    private static taskGroupMap: TaskGroupMap;

    public static createTaskGroup(name: string, storeType: StoreType): TaskGroupMap | null {
        if (this.taskGroupMap.has(name)) {
            log('[Group %s already exists]', name);
            return null;
        }

        const taskGroup = new TaskGroup(name, storeType);
        this.taskGroupMap.set(name, taskGroup);

        return this.taskGroupMap;
    }

    public static removeTaskGroup(name: string): TaskGroupMap | null {
        if (!this.taskGroupMap.has(name)) {
            log('[Group %s not found]', name);
            return null;
        }

        this.taskGroupMap.delete(name);
        return this.taskGroupMap;
    }
}
