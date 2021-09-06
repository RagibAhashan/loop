export const ERRORS_SHIPPING: any = {
    0: "Can't ship to international address 🌍",
    NoSuchMessageException: 'Proxy Banned',
};

export const ERRORS_CHECKOUT: any = {
    12502: 'Product no longer available',
    11506: 'Product no longer available',
};

export const ERRORS_CART: any = {
    ProductLowStockException: 'Size Out of Stock, retrying',
    NotFoundException: 'Product not Found',
};

export const ERRORS_PAYMENT: any = {
    12001: 'Card declined 💳',
    0: 'Card declined 💳',
    13530: "Can't ship to address 🏠",
    13506: "State and ZIP Code don't match",
};

export const STATUS_ERROR: any = {
    429: ' (Rate Limit)',
    403: ' (DataDome Protected)',
};
