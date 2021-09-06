import { TaskData } from '../interfaces/TaskInterfaces';

export interface StoreState {
    tasks: TaskData[];
    runningTasks: number;
}

class StoreService {
    getTasks(storeKey: string): TaskData[] {
        const store = JSON.parse(localStorage.getItem(storeKey) as string) as StoreState;
        if (!store) return [];

        return store.tasks;
    }

    getNumRunningTasks(storeKey: string): number {
        const store = JSON.parse(localStorage.getItem(storeKey) as string) as StoreState;
        if (!store) return 0;

        return store.runningTasks;
    }

    setNumRunningTasks(storeKey: string, numRunning: number) {
        let store = JSON.parse(localStorage.getItem(storeKey) as string) as StoreState;
        if (!store) return;

        store = { ...store, runningTasks: numRunning };

        localStorage.setItem(storeKey, JSON.stringify(store));
    }

    countRunningTasks(storeKey: string): number {
        const store = JSON.parse(localStorage.getItem(storeKey) as string) as StoreState;
        if (!store) return 0;

        const numRunningTasks = store.tasks.filter((task) => task.running === true).length;

        return numRunningTasks;
    }

    setTasks(storeKey: string, tasks: TaskData[]): void {
        let store = JSON.parse(localStorage.getItem(storeKey) as string) as StoreState;
        if (!store) {
            store = { runningTasks: 0, tasks: tasks };
        } else {
            store = { ...store, tasks: tasks };
        }

        localStorage.setItem(storeKey, JSON.stringify(store));
    }

    delete(storeKey: string): void {
        localStorage.removeItem(storeKey);
    }
}

export const storeService = new StoreService();
