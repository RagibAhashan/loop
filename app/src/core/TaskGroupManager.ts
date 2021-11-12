import { TaskGroup } from './TaskGroup';

export class TaskGroupManager {
    private taskGroupMap: Map<string, TaskGroup>;

    constructor() {
        this.taskGroupMap = new Map();
    }

    getGroup(name: string): TaskGroup | undefined {
        return this.taskGroupMap.get(name);
    }

    getAllGroups(): Map<string, TaskGroup> {
        return this.taskGroupMap;
    }

    register(name: string, group: TaskGroup): void {
        this.taskGroupMap.set(name, group);
    }

    remove(name: string): void {
        this.taskGroupMap.delete(name);
    }
}
