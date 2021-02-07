const { FOOTLOCKER_CA_HEADERS, FOOTLOCKER_COM_HEADERS } = require('../core/constants/Constants');

const CAPTCHA_ROUTE = 'captcha';

const STORES = {
    FootlockerCA: {
        name: 'Footlocker CA',
        url: 'https://footlocker.ca/api',
        key: 'FootlockerCA',
        header: FOOTLOCKER_CA_HEADERS,
    },
    FootlockerUS: {
        name: 'Footlocker US',
        url: 'https://footlocker.com/api',
        key: 'FootlockerUS',
        header: FOOTLOCKER_COM_HEADERS,
    },
};

// CHANNEL EVENTS
const NOTIFY_STOP_TASK = 'stop-task';
const NOTIFY_START_TASK = 'start-task';
const TASK_STOPPED = 'task-stopped';

module.exports = { CAPTCHA_ROUTE, NOTIFY_STOP_TASK, TASK_STOPPED, NOTIFY_START_TASK, STORES };
