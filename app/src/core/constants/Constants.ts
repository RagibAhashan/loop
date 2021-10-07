export const STATUS_EVENT = 'status';

export enum MESSAGES {
    SESSION_INFO_MESSAGE = 'Getting Session',
    SESSION_QUEUE_MESSAGE = 'Getting Session (In Queue)',
    SESSION_ERROR_MESSAGE = 'Getting Session Failed',
    CHECKING_STOCK_INFO_MESSAGE = 'Checking Stock',
    CHECKING_STOCK_QUEUE_MESSAGE = 'Checking Stock (In Queue)',
    CHECKING_STOCK_ERROR_MESSAGE = 'Checking Stock Failed',
    OOS_RETRY_MESSAGE = 'Out of Stock, retrying',
    ADD_CART_INFO_MESSAGE = 'Adding to Cart',
    ADD_CART_ERROR_MESSAGE = 'Adding to Cart Failed',
    WAIT_CAPTCHA_MESSAGE = 'Waiting on Captcha',
    BILLING_INFO_MESSAGE = 'Setting Shipping and Billing',
    BILLING_ERROR_MESSAGE = 'Setting Billing Failed',
    ADDRESS_ERROR_MESSAGE = 'Setting Delivery Address Failed',
    PLACING_ORDER_INFO_MESSAGE = 'Placing Order',
    PLACING_ORDER_ERROR_MESSAGE = 'Placing Order Failed (Retrying)',
    CHECKOUT_FAILED_MESSAGE = 'Payment Failed',
    CHECKOUT_SUCCESS_MESSAGE = 'Checkout ! 🚀',
    CANCELED_MESSAGE = 'Task Canceled 💔',
    CANCELING_MESSAGE = 'Canceling Task',
    GETTING_PRODUCT_INFO_MESSAGE = 'Getting Product',
    CREDIT_CARD_REJECTED = 'Credit Card Rejected 💳',
}

export const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36';
