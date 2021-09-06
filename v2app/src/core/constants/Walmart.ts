import { COMMONG_HEADERS } from './Constants';

// Headers used to request https://walmart.com/ip/productname/productid
export const WALMART_US_PRODUCT_PAGE_HEADERS = {
    ...COMMONG_HEADERS,
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-CA,en-US;q=0.9,en;q=0.8,fr;q=0.7',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'service-worker-navigation-preload': 'true',
    'upgrade-insecure-requests': '1',
};

export const WALMART_US_ATC_HEADERS = {
    ...COMMONG_HEADERS,
    accept: 'application/json',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-CA,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    origin: 'https://www.walmart.com',
    pragma: 'no-cache',
    'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
};

export const WALMART_US_CHECKOUT_CART_HEADERS = {
    ...COMMONG_HEADERS,
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/json',
    Referer: 'https://www.walmart.com/checkout/',
    'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    'sec-ch-ua-mobile': '?0',
    WM_CVV_IN_SESSION: 'true',
    WM_VERTICAL_ID: '0',
};

export const WALMART_US_SHIPPING_HEADERS = {
    ...COMMONG_HEADERS,
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-CA,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    inkiru_precedence: 'false',
    origin: 'https://www.walmart.com',
    pragma: 'no-cache',
    referer: 'https://www.walmart.com/checkout/',
    'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    wm_cvv_in_session: 'true',
    wm_vertical_id: '0',
};

export const WALMART_US_CREDIT_CARD_HEADERS = { ...WALMART_US_SHIPPING_HEADERS };

export const WALMART_US_CONFIRM_PAYMENT_HEADERS = {
    ...COMMONG_HEADERS,
    accept: 'application/json, text/javascript, */*; q=0.01',
    'content-type': 'application/json',
    inkiru_precedence: 'false',
    Referer: 'https://www.walmart.com/checkout/',
    'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    'sec-ch-ua-mobile': '?0',
    wm_cvv_in_session: 'true',
    wm_vertical_id: '0',
};

export const WALMART_US_CHECKOUT_HEADERS = {
    ...WALMART_US_CONFIRM_PAYMENT_HEADERS,
};
