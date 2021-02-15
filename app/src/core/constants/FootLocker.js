const ERRORS_SHIPPING = {
    0: "Can't ship to international address 🌍",
    NoSuchMessageException: 'Proxy Banned',
};

const ERRORS_CART = {
    11518: 'Size Out of Stock, retrying',
};

const ERRORS_PAYMENT = {
    12001: 'Card declined 💳',
    0: 'Card declined 💳',
    13530: "Can't ship to address 🏠",
    13506: "State and ZIP Code don't match",
};

module.exports = { ERRORS_PAYMENT, ERRORS_SHIPPING, ERRORS_CART };
