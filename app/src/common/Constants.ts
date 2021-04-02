import { FOOTLOCKER_CA_HEADERS, FOOTLOCKER_COM_HEADERS } from '../core/constants/Constants';

export const CAPTCHA_ROUTE = 'captcha';
export const APP_ROUTE = '/app';
export const PROFILE_ROUTE = '/app/profiles';
export const PROXY_ROUTE = '/app/proxies';
export const SETTINGS_ROUTE = '/app/settings';
export const TASKS_ROUTE = '/app/tasks';

export const VALIDATE_USER_DATA_ROUTE = '/license/validate';
export const ACTIVATE_LICENSE_ROUTE = '/license/activate';

type STORE = { [key: string]: { [key: string]: any } };
export const STORES: STORE = {
    FootlockerCA: {
        name: 'Footlocker CA',
        baseURL: 'https://www.footlocker.ca/api',
        key: 'FootlockerCA',
        header: FOOTLOCKER_CA_HEADERS,
        url: 'https://www.footlocker.ca',
        siteKey: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX', //captcha key
    },
    FootlockerUS: {
        name: 'Footlocker US',
        baseURL: 'https://www.footlocker.com/api',
        key: 'FootlockerUS',
        header: FOOTLOCKER_COM_HEADERS,
        url: 'https://www.footlocker.com',
        siteKey: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX',
    },
};

// CHANNEL EVENTS
export const NOTIFY_STOP_TASK = 'stop-task';
export const NOTIFY_START_TASK = 'start-task';
export const NOTIFY_EDIT_TASK = 'edit-task';
export const NOTIFY_CAPTCHA = 'captcha';
export const GET_DATADOME = 'get-datadome';
export const NOTIFY_CAPTCHA_SOLVED = 'captcha-solved';
export const TASK_STOPPED = 'task-stopped';
export const TASK_STOP = 'task-stop';
export const TASK_STATUS = 'status';
export const TASK_SUCCESS = 'checkout';

export const CAPTHA_WINDOW_CLOSED = 'captcha-closed';

export const GET_SYSTEM_ID = 'GET-SYSTEM-ID';
export const NOTIFY_STOP_PROXY_TEST = 'stop-proxy';
export const NOTIFY_START_PROXY_TEST = 'start-proxy';
export const PROXY_TEST_SUCCEEDED = 'sucess-proxy';
export const PROXY_TEST_STOPPED = 'proxy-stopped';
export const PROXY_TEST_REPLY = 'proxy-reply';
