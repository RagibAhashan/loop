const { FOOTLOCKER_CA_HEADERS, FOOTLOCKER_COM_HEADERS } = require('../core/constants/Constants');

const CAPTCHA_ROUTE = 'captcha';

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
const NOTIFY_CAPTCHA = 'captcha';
const TASK_STOPPED = 'task-stopped';
const GET_SYSTEM_ID = 'GET-SYSTEM-ID';
const NOTIFY_STOP_PROXY = 'stop-proxy';
const NOTIFY_START_PROXY = 'start-proxy';

module.exports = {
    CAPTCHA_ROUTE,
    GET_SYSTEM_ID,
    NOTIFY_STOP_TASK,
    TASK_STOPPED,
    NOTIFY_START_TASK,
    NOTIFY_CAPTCHA,
    STORES,
    NOTIFY_STOP_PROXY,
    NOTIFY_START_PROXY,
};
