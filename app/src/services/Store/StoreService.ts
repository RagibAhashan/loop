import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NOTIFY_EDIT_TASK, NOTIFY_STOP_TASK } from '../../common/Constants';
import { assignProxy, deleteAllProxiesFromSet, deleteProxyFromSet } from '../Proxy/ProxyService';
import { StoreType } from './../../constants/Stores';
import { AppState } from './../../global-store/GlobalStore';
import { Status, Task, TaskData } from './../../interfaces/TaskInterfaces';
const { ipcRenderer } = window.require('electron');

export interface Store {
    tasks: Task;
    running: boolean;
    displayName: string;
}

export type StoreState = { [key in StoreType]: Store };

export interface StorePayload {
    storeKey: StoreType;
}

export interface AddStorePayload extends StorePayload {
    storeName: string;
}

export interface TaskPayload extends StorePayload {
    uuid: string;
}

export interface AddTaskPayload extends StorePayload {
    tasks: TaskData[];
}

export interface EditAllTasksPayload extends StorePayload {
    newValue: any;
}

export interface EditTaskPayload extends TaskPayload {
    newValue: any;
}

export interface StatusTaskPayload extends TaskPayload {
    status: Status;
}

const initialState = {} as StoreState;

export const storeSlice = createSlice({
    name: 'stores',
    initialState: initialState,
    reducers: {
        addStore: (state, action: PayloadAction<AddStorePayload>) => {
            state[action.payload.storeKey] = { tasks: {}, running: false, displayName: action.payload.storeName };
        },
        deleteStore: (state, action: PayloadAction<StorePayload>) => {
            delete state[action.payload.storeKey];
        },
        addTask: (state, action: PayloadAction<AddTaskPayload>) => {
            action.payload.tasks.forEach((task) => {
                state[action.payload.storeKey].tasks[task.uuid] = task;
            });
        },
        deleteAllTasks: (state, action: PayloadAction<StorePayload>) => {
            state[action.payload.storeKey].tasks = {};
        },
        deleteTask: (state, action: PayloadAction<TaskPayload>) => {
            ipcRenderer.send(NOTIFY_STOP_TASK(action.payload.storeKey), action.payload.uuid);
            localStorage.removeItem(action.payload.uuid);
            delete state[action.payload.storeKey].tasks[action.payload.uuid];
        },
        editAllTasks: (state, action: PayloadAction<EditAllTasksPayload>) => {
            Object.entries(state[action.payload.storeKey].tasks).forEach(([uuid, task]) => {
                state[action.payload.storeKey].tasks[uuid] = { ...task, ...action.payload.newValue };
                ipcRenderer.send(NOTIFY_EDIT_TASK, uuid);
            });
        },
        editTask: (state, action: PayloadAction<EditTaskPayload>) => {
            state[action.payload.storeKey].tasks[action.payload.uuid] = {
                ...state[action.payload.storeKey].tasks[action.payload.uuid],
                ...action.payload.newValue,
            };
            ipcRenderer.send(NOTIFY_EDIT_TASK, action.payload.uuid);
        },
        startTask: (state, action: PayloadAction<TaskPayload>) => {
            state[action.payload.storeKey].tasks[action.payload.uuid].running = true;
            state[action.payload.storeKey].running = true;
        },
        stopTask: (state, action: PayloadAction<TaskPayload>) => {
            state[action.payload.storeKey].tasks[action.payload.uuid].running = false;

            const anyTaskRunning = Object.values(state[action.payload.storeKey].tasks).some((task) => task.running);
            state[action.payload.storeKey].running = anyTaskRunning;
        },
        updateTaskStatus: (state, action: PayloadAction<StatusTaskPayload>) => {
            state[action.payload.storeKey].tasks[action.payload.uuid].status = action.payload.status;
        },
        startAllTasks: (state, action: PayloadAction<StorePayload>) => {
            Object.values(state[action.payload.storeKey].tasks).forEach((task) => {
                task.running = true;
            });
            state[action.payload.storeKey].running = true;
        },
        stopAllTasks: (state, action: PayloadAction<StorePayload>) => {
            Object.values(state[action.payload.storeKey].tasks).forEach((task) => {
                task.running = false;
            });
            state[action.payload.storeKey].running = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(assignProxy, (state, action) => {
                for (let i = 0; i < action.payload.proxiesToTask.length; ++i) {
                    state[action.payload.storeKey].tasks[action.payload.proxiesToTask[i].taskUUID].proxy = action.payload.proxiesToTask[i].proxy;
                }
            })
            .addCase(deleteAllProxiesFromSet, (state, action) => {
                Object.values(state).forEach((store) => {
                    Object.values(store.tasks).forEach((task) => {
                        task.proxy = task.proxySet = null;
                    });
                });
            })
            .addCase(deleteProxyFromSet, (state, action) => {
                Object.values(state).forEach((store) => {
                    Object.values(store.tasks).forEach((task) => {
                        if (task.proxy?.host === action.payload.proxyHost) task.proxy = task.proxySet = null;
                    });
                });
            });
    },
});

// SELECTORS
export const getStores = (state: AppState) => state.stores;

export const getStoreById = (state: AppState, storeKey: StoreType) => state.stores[storeKey];

// TODO validate that stores contains storeKey
export const getTasksByStore = (state: AppState, storeKey: StoreType) => state.stores[storeKey].tasks;

export const getTaskById = (state: AppState, storeKey: StoreType, uuid: string) => state.stores[storeKey].tasks[uuid];

export const isStoreCreated = (state: AppState, storeKey: StoreType) => {
    return state.stores[storeKey] ? true : false;
};

// ACTIONS
export const {
    addStore,
    deleteStore,
    addTask,
    deleteAllTasks,
    deleteTask,
    editAllTasks,
    editTask,
    startTask,
    stopTask,
    updateTaskStatus,
    startAllTasks,
    stopAllTasks,
} = storeSlice.actions;

// REDUCER
export default storeSlice.reducer;
