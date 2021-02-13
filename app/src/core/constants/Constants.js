const STATUS_EVENT = 'status';
const SESSION_INFO_MESSAGE = 'Getting Session';
const SESSION_ERROR_MESSAGE = 'Getting Session Failed';
const CHECKING_SIZE_INFO_MESSAGE = 'Checking Stock';
const CHECKING_SIZE_ERROR_MESSAGE = 'Checking Stock Failed';
const CHECKING_SIZE_RETRY_MESSAGE = 'Out of Stock, retrying';
const ADD_CART_INFO_MESSAGE = 'Adding to Cart';
const ADD_CART_ERROR_MESSAGE = 'Adding to Cart Failed';
const WAIT_CAPTCHA_MESSAGE = 'Waiting on Captcha';
const BILLING_INFO_MESSAGE = 'Setting Billing Info';
const BILLING_ERROR_MESSAGE = 'Setting Billing Failed';
const SHIPPING_INFO_MESSAGE = 'Setting Shipping Info';
const SHIPPING_ERROR_MESSAGE = 'Setting Shipping Failed';
const EMAIL_INFO_MESSAGE = 'Setting Email Info';
const EMAIL_ERROR_MESSAGE = 'Setting Email Failed';
const PLACING_ORDER_INFO_MESSAGE = 'Placing Order';
const CHECKOUT_FAILED_MESSAGE = 'Checkout Failed';
const CHECKOUT_SUCCESS_MESSAGE = 'Checkout ! 🚀';
const CANCELED_MESSAGE = 'Task Canceled 💔';
const CANCELING_MESSAGE = 'Canceling Task';

const FOOTLOCKER_CA_HEADERS = {
    // accept: 'application/json',
    // 'accept-encoding': 'gzip, deflate, br',
    // 'accept-language': 'en-CA,en;q=0.9',
    // 'cache-control': 'no-cache',
    // 'content-type': 'application/json',
    // pragma: 'no-cache',
    // origin: 'https://www.footlocker.ca',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.3=',
    // 'sec-fetch-dest': 'empty',
    // 'sec-fetch-mode': 'cors',
    // 'sec-fetch-site': 'same-origin',
    // 'x-api-lang': 'en-CA',
};

const FOOTLOCKER_COM_HEADERS = {
    accept: 'application/json',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-CA,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    pragma: 'no-cache',
    origin: 'https://www.footlocker.com',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.3=',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-api-lang': 'en-CA',
};
module.exports = {
    FOOTLOCKER_CA_HEADERS,
    FOOTLOCKER_COM_HEADERS,
    STATUS_EVENT,
    SESSION_INFO_MESSAGE,
    SESSION_ERROR_MESSAGE,
    CHECKING_SIZE_INFO_MESSAGE,
    CHECKING_SIZE_ERROR_MESSAGE,
    ADD_CART_INFO_MESSAGE,
    ADD_CART_ERROR_MESSAGE,
    BILLING_INFO_MESSAGE,
    BILLING_ERROR_MESSAGE,
    SHIPPING_INFO_MESSAGE,
    SHIPPING_ERROR_MESSAGE,
    EMAIL_INFO_MESSAGE,
    EMAIL_ERROR_MESSAGE,
    PLACING_ORDER_INFO_MESSAGE,
    CHECKOUT_FAILED_MESSAGE,
    CHECKOUT_SUCCESS_MESSAGE,
    WAIT_CAPTCHA_MESSAGE,
    CHECKING_SIZE_RETRY_MESSAGE,
    CANCELED_MESSAGE,
    CANCELING_MESSAGE,
};
