import { Observable, Subject } from 'rxjs';
import { StoreState } from '../StoreService';

class BaseTaskService {
    notifyStart = new Subject<void>();

    notify(): void {
        this.notifyStart.next();
    }

    listenStart(): Observable<void> {
        return this.notifyStart.asObservable();
    }

    setRunning(storeKey: string, uuid: string, value: boolean): void {
        let store = JSON.parse(localStorage.getItem(storeKey) as string) as StoreState;

        if (!store) return;

        const newTasks = store.tasks.map((task) => (task.uuid === uuid ? { ...task, running: value } : task));

        store = { ...store, tasks: newTasks };

        localStorage.setItem(storeKey, JSON.stringify(store));
    }
}

export const taskService = new BaseTaskService();
