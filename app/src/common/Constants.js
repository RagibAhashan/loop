const { FOOTLOCKER_CA_HEADERS, FOOTLOCKER_COM_HEADERS } = require('../core/constants/Constants');

const CAPTCHA_ROUTE = 'captcha';
const APP_ROUTE = '/app';
const PROFILE_ROUTE = '/app/profiles';
const PROXY_ROUTE = '/app/proxies';
const SETTINGS_ROUTE = '/app/settings';
const TASKS_ROUTE = '/app/tasks';

const STORES = {
    FootlockerCA: {
        name: 'Footlocker CA',
        url: 'https://www.footlocker.ca/api',
        key: 'FootlockerCA',
        header: FOOTLOCKER_CA_HEADERS,
    },
    FootlockerUS: {
        name: 'Footlocker US',
        url: 'https://www.footlocker.com/api',
        key: 'FootlockerUS',
        header: FOOTLOCKER_COM_HEADERS,
    },
};

// CHANNEL EVENTS
const NOTIFY_STOP_TASK = 'stop-task';
const NOTIFY_START_TASK = 'start-task';
const NOTIFY_EDIT_TASK = 'edit-task';
const NOTIFY_CAPTCHA = 'captcha';
const NOTIFY_CAPTCHA_SOLVED = 'captcha-solved';
const TASK_STOPPED = 'task-stopped';
const TASK_STOP = 'task-stop';
const TASK_STATUS = 'status';
const TASK_SUCCESS = 'checkout';

const CAPTHA_WINDOW_CLOSED = 'captcha-closed';

const GET_SYSTEM_ID = 'GET-SYSTEM-ID';
const NOTIFY_STOP_PROXY_TEST = 'stop-proxy';
const NOTIFY_START_PROXY_TEST = 'start-proxy';
const PROXY_TEST_STOPPED = 'proxy-stopped';

module.exports = {
    CAPTCHA_ROUTE,
    GET_SYSTEM_ID,
    NOTIFY_STOP_TASK,
    TASK_STOPPED,
    NOTIFY_START_TASK,
    NOTIFY_CAPTCHA,
    STORES,
    NOTIFY_EDIT_TASK,
    NOTIFY_STOP_PROXY_TEST,
    NOTIFY_START_PROXY_TEST,
    PROXY_TEST_STOPPED,
    CAPTHA_WINDOW_CLOSED,
    TASK_STOP,
    TASK_STATUS,
    NOTIFY_CAPTCHA_SOLVED,
    PROXY_ROUTE,
    TASKS_ROUTE,
    PROFILE_ROUTE,
    SETTINGS_ROUTE,
    APP_ROUTE,
    TASK_SUCCESS,
};
