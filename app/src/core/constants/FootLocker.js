const ERRORS_SHIPPING = {
    0: "Can't ship to international address 🌍",
    NoSuchMessageException: 'Proxy Banned',
};

/*
on get product info
{
    "errors": [
        {
          "code": "11506",
          "message": "The product you are trying to view is no longer available.",
          "type": "FlBusinessErrorWebServiceException"
        }
      ]
    }
    */

const ERRORS_CART = {
    ProductLowStockException: 'Size Out of Stock, retrying',
};

const ERRORS_PAYMENT = {
    12001: 'Card declined 💳',
    0: 'Card declined 💳',
    13530: "Can't ship to address 🏠",
    13506: "State and ZIP Code don't match",
};

const STATUS_ERROR = {
    429: ' (Rate Limit)',
    403: ' (DataDome Protected)',
};

module.exports = { ERRORS_PAYMENT, ERRORS_SHIPPING, ERRORS_CART, STATUS_ERROR };
