import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NOTIFY_STOP_TASK } from '../../common/Constants';
import { assignProxy, deleteAllProxiesFromSet, deleteProxyFromSet } from '../Proxy/ProxyService';
import { StoreType } from './../../constants/Stores';
import { AppState } from './../../global-store/GlobalStore';
import { Captcha, Status, TaskData, TaskMap } from './../../interfaces/TaskInterfaces';
export interface Store {
    tasks: TaskMap;
    captchas: Captcha[]; //Queue of captchas
    running: boolean;
    displayName: string;
    isCaptchaWindowOpen: boolean;
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
    newValue: Partial<TaskData>;
}

export interface EditTaskPayload extends TaskPayload {
    newValue: Partial<TaskData>;
}

export interface StatusTaskPayload extends TaskPayload {
    status: Status;
}

export interface CaptchaPayload extends StorePayload {
    captcha: Captcha;
}

export interface CaptchaQueuePayload extends StorePayload {
    captchaQueue: Captcha[];
}

const initialState = {} as StoreState;

export const storeSlice = createSlice({
    name: 'stores',
    initialState: initialState,
    reducers: {
        addStore: (state, action: PayloadAction<AddStorePayload>) => {
            state[action.payload.storeKey] = {
                tasks: {},
                running: false,
                displayName: action.payload.storeName,
                captchas: [],
                isCaptchaWindowOpen: false,
            };
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

            // delete all captchas
            state[action.payload.storeKey].captchas = [];
        },
        deleteTask: (state, action: PayloadAction<TaskPayload>) => {
            window.ElectronBridge.send(NOTIFY_STOP_TASK(action.payload.storeKey), action.payload.uuid);
            localStorage.removeItem(action.payload.uuid);
            // remove captcha if task was in captcha queue
            state[action.payload.storeKey].captchas = state[action.payload.storeKey].captchas.filter((cap) => cap.taskUUID !== action.payload.uuid);
            delete state[action.payload.storeKey].tasks[action.payload.uuid];
        },
        editAllTasks: (state, action: PayloadAction<EditAllTasksPayload>) => {
            Object.entries(state[action.payload.storeKey].tasks).forEach(([uuid, task]) => {
                const updatedTask = { ...task, ...action.payload.newValue };
                state[action.payload.storeKey].tasks[uuid] = updatedTask;
            });
        },
        editTask: (state, action: PayloadAction<EditTaskPayload>) => {
            const updatedTask = {
                ...state[action.payload.storeKey].tasks[action.payload.uuid],
                ...action.payload.newValue,
            };

            state[action.payload.storeKey].tasks[action.payload.uuid] = updatedTask;
        },
        startTask: (state, action: PayloadAction<TaskPayload>) => {
            state[action.payload.storeKey].tasks[action.payload.uuid].running = true;
            state[action.payload.storeKey].running = true;
        },
        stopTask: (state, action: PayloadAction<TaskPayload>) => {
            state[action.payload.storeKey].tasks[action.payload.uuid].running = false;

            const isAnyTaskRunning = Object.values(state[action.payload.storeKey].tasks).some((task) => task.running);
            state[action.payload.storeKey].running = isAnyTaskRunning;

            // remove captcha if task was in captcha queue
            state[action.payload.storeKey].captchas = state[action.payload.storeKey].captchas.filter((cap) => cap.taskUUID !== action.payload.uuid);
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
            // delete all captchas
            state[action.payload.storeKey].captchas = [];
        },
        addCaptchaToQueue: (state, action: PayloadAction<CaptchaPayload>) => {
            state[action.payload.storeKey].captchas.push(action.payload.captcha);
        },
        updateCaptchaQueue: (state, action: PayloadAction<CaptchaQueuePayload>) => {
            state[action.payload.storeKey].captchas = action.payload.captchaQueue;
        },
        openCaptchaWindow: (state, action: PayloadAction<StorePayload>) => {
            state[action.payload.storeKey].isCaptchaWindowOpen = true;
        },
        closeCaptchaWindow: (state, action: PayloadAction<StorePayload>) => {
            state[action.payload.storeKey].isCaptchaWindowOpen = false;
        },
    },
    // These extra reducers will run whenever an action from an external reducer will run
    // i.e whenever assignProxy is called from the Proxy reducer, it will execute some logic here
    extraReducers: (builder) => {
        builder
            .addCase(assignProxy, (state, action) => {
                console.log('assigning proxy to tasks');
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

export const isCaptchaWindowOpen = (state: AppState, storeKey: StoreType) => state.stores[storeKey].isCaptchaWindowOpen;

// TODO validate that stores contains storeKey
export const getTasksByStore = (state: AppState, storeKey: StoreType) => state.stores[storeKey].tasks;

export const getTaskById = (state: AppState, storeKey: StoreType, uuid: string) => state.stores[storeKey].tasks[uuid];

export const isStoreCreated = (state: AppState, storeKey: StoreType) => {
    return state.stores[storeKey] ? true : false;
};

export const getCaptchaQueueFromStore = (state: AppState, storeKey: StoreType): Captcha[] => state.stores[storeKey].captchas;

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
    addCaptchaToQueue,
    updateCaptchaQueue,
    openCaptchaWindow,
    closeCaptchaWindow,
} = storeSlice.actions;

// REDUCER
export default storeSlice.reducer;
