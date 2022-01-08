import { StoreType } from '@constants/stores';

export const CAPTCHA_ROUTE = 'captcha';
export const APP_ROUTE = '/app';
export const PROFILE_ROUTE = '/app/profiles';
export const PROXY_ROUTE = '/app/proxies';
export const SETTINGS_ROUTE = '/app/settings';
export const TASKS_ROUTE = '/app/tasks';
export const ACCOUNTS_ROUTE = '/app/accounts';
export const SERVER_ENDPOINT = 'http://localhost:4000';
export const VALIDATE_USER_DATA_ROUTE = '/license/validate';
export const ACTIVATE_LICENSE_ROUTE = '/license/activate';

// CHANNEL EVENTS
export const NOTIFY_ADD_TASK = (store: StoreType) => `add-task-${store}`;
export const NOTIFY_STOP_TASK = (store: StoreType) => `stop-task-${store}`;
export const NOTIFY_START_TASK = (store: StoreType) => `start-task-${store}`;
export const NOTIFY_TASK_STATUS = (store: StoreType) => `task-status-${store}`;
export const GET_DATADOME = (store: StoreType) => `get-datadome-${store}`;
export const NOTIFY_EDIT_TASK = (store: StoreType) => `edit-task-${store}`;
export const NOTIFY_ON_START_INIT_TASK = (store: StoreType) => `on-start-init-tasks-${store}`;
export const NOTIFY_CAPTCHA_TASK = 'task-notify-captcha';
export const NOTIFY_CAPTCHA_STORE = (store: StoreType) => `notify-captcha-${store}`;
export const NOTIFY_CAPTCHA_SOLVED = 'captcha-solved';
export const TASK_STOPPED = 'task-stopped';
export const TASK_STOP = 'task-stop';
export const TASK_STATUS = 'status';
export const TASK_SUCCESS = 'checkout';

// Channels for communication between renderer and main process to open or close captcha window
export const CAPTHA_WINDOW_CLOSED = (store: StoreType) => `captcha-window-closed-${store}`;
export const CAPTHA_WINDOW_OPEN = 'open-captcha-window';
export const STORE_KEY = 'store-key';
export const SET_PROXY_CAPTCHA_WINDOW = 'set-proxy-cap-win';

export const GET_SYSTEM_ID = 'get-system-id';
export const ACCESS_GRANTED = 'access-granted';
export const NOTIFY_STOP_PROXY_TEST = 'stop-proxy';
export const NOTIFY_START_PROXY_TEST = 'start-proxy';
export const PROXY_TEST_SUCCEEDED = 'sucess-proxy';
export const PROXY_TEST_STOPPED = 'proxy-stopped';
export const PROXY_TEST_REPLY = 'proxy-reply';
