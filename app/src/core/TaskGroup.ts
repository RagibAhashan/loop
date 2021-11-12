import { StoreType } from '../constants/Stores';
import { Task } from './Task';

export class TaskGroup {
    private name: string;
    private tasks: Map<string, Task>;
    private storeType: StoreType;

    constructor(name: string, storeType: StoreType) {
        this.name = name;
        this.storeType = storeType;
        this.tasks = new Map();
    }
}
