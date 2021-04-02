export const STATUS_EVENT = 'status';

export enum MESSAGES {
    SESSION_INFO_MESSAGE = 'Getting Session',
    SESSION_QUEUE_MESSAGE = 'Getting Session (In Queue)',
    SESSION_ERROR_MESSAGE = 'Getting Session Failed',
    CHECKING_SIZE_INFO_MESSAGE = 'Checking Stock',
    CHECKING_SIZE_QUEUE_MESSAGE = 'Checking Stock (In Queue)',
    CHECKING_SIZE_ERROR_MESSAGE = 'Checking Stock Failed',
    CHECKING_SIZE_RETRY_MESSAGE = 'Out of Stock, retrying',
    ADD_CART_INFO_MESSAGE = 'Adding to Cart',
    ADD_CART_ERROR_MESSAGE = 'Adding to Cart Failed',
    WAIT_CAPTCHA_MESSAGE = 'Waiting on Captcha',
    BILLING_INFO_MESSAGE = 'Setting Shipping and Billing',
    BILLING_ERROR_MESSAGE = 'Setting Billing Failed',
    PLACING_ORDER_INFO_MESSAGE = 'Placing Order',
    CHECKOUT_FAILED_MESSAGE = 'Checkout Failed',
    CHECKOUT_SUCCESS_MESSAGE = 'Checkout ! 🚀',
    CANCELED_MESSAGE = 'Task Canceled 💔',
    CANCELING_MESSAGE = 'Canceling Task',
}

export const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36';

export const COMMONG_HEADERS = {
    'user-agent': ua,
};
export const FOOTLOCKER_CA_HEADERS = {
    ...COMMONG_HEADERS,
    // accept: 'application/json',
    // 'accept-encoding': 'gzip, deflate, br',
    // 'accept-language': 'en-CA,en;q=0.9',
    // 'cache-control': 'no-cache',
    // 'content-type': 'application/json',
    // pragma: 'no-cache',
    // origin: 'https://www.footlocker.ca',
    // 'sec-fetch-dest': 'empty',
    // 'sec-fetch-mode': 'cors',
    // 'sec-fetch-site': 'same-origin',
    // 'x-api-lang': 'en-CA',
};

export const FOOTLOCKER_COM_HEADERS = {
    ...COMMONG_HEADERS,
    // accept: 'application/json',
    // 'accept-encoding': 'gzip, deflate, br',
    // 'accept-language': 'en-CA,en;q=0.9',
    // 'cache-control': 'no-cache',
    // 'content-type': 'application/json',
    // pragma: 'no-cache',
    // origin: 'https://www.footlocker.com',
    // 'sec-fetch-dest': 'empty',
    // 'sec-fetch-mode': 'cors',
    // 'sec-fetch-site': 'same-origin',
    // 'x-api-lang': 'en-CA',
};
