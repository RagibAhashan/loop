const axios = require("axios").default;
const API = "https://www.footlocker.ca/api";
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
const user = require("./info.json");

// Client side script
require("browser-env")();
require("./scripts/2615645779051917");
const { adyen_key } = require("./scripts/keys");
const cookie_utils = require("./utils/cookies");
const ioGetBlackbox = require("./scripts/snare");

/*
These are some headers shared with requests
*/
const defaultHeaders = {
    accept: "application/json",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-CA,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    pragma: "no-cache",
    origin: "https://www.footlocker.ca",
    "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.3=",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-api-lang": "en-CA",
};

/*
Axios object that will be applied to every subsequent request
*/
const axiosSession = axios.create({
    baseURL: API,
    params: { timestamp: Date.now() },
    headers: defaultHeaders,
});

/**
 * Summary. Obtain session information
 *
 * Description. Make a get request to the session endpoint retrieve the JSESSIONID cookie and the csrf token.
 *
 * @return {Object} Return a token object : {JSESSIONID: "", csrf: "", cartguid: ""}.
 *                  The cartguid is empty initially
 */
async function instanciateSession() {
    const response = await axiosSession.get("/v4/session");

    const JSESSIONID = response.headers["set-cookie"][0].split(" ")[0];
    const csrfToken = response.data["data"]["csrfToken"];

    const tokens = {
        jsessionid: JSESSIONID,
        csrf: csrfToken,
        cartguid: "",
    };

    console.log("Session Init OK... ", response.status);

    return tokens;
}

async function getProductsCode(productSKU) {
    const response = await axiosSession.get(`/products/pdp/${productSKU}`);
    const sellableUnits = response.data["sellableUnits"];
    const allShoes = sellableUnits
        .filter((unit) => unit.stockLevelStatus === "inStock")
        .map((inStock) => {
            const newShoe = { name: "", value: "" };

            inStock.attributes.map((attr) => {
                newShoe.name += attr.value + " ";
                newShoe.value = inStock.code;
            });
            return newShoe;
        });

    return allShoes;
}

async function promptDelay() {
    const ans = await prompt([
        {
            type: "number",
            name: "delay",
            message: "Enter delay in seconds",
        },
    ]);

    return ans.delay;
}
async function promptProduct() {
    const ans = await prompt([
        {
            type: "input",
            name: "link",
            message: "Enter product link",
        },
        {
            type: "input",
            name: "sku",
            message: "Enter product SKU",
        },
    ]);

    return ans;
}

async function promptProductSize(products) {
    const ans = await prompt([
        {
            type: "list",
            name: "code",
            message: "Choose a sneaker size (in stock)",
            choices: products,
            loop: false,
        },
    ]);
    return ans;
}

async function addToCart(code, productLink, tokens) {
    try {
        const headers = {
            referer: productLink,
            cookie: tokens.jsessionid,
            "x-fl-productid": code,
            "x-csrf-token": tokens.csrf,
        };

        const body = { productQuantity: "1", productId: code };

        const response = await axiosSession.post(
            "/users/carts/current/entries",
            body,
            { headers: headers }
        );

        console.log("Adding to cart OK... ", response.status);

        return response.headers["set-cookie"][0].split(" ")[0];
    } catch (error) {
        // TODO WIP Captcha
        /*
        if (error.response && "url" in error.response.data) {
            const cookies = error.response.headers["set-cookie"][0];
            const datadome = cookie_utils.extract(cookies, "datadome");
            const captcha_url = `${error.response.data["url"]}&cid=${datadome}&referer=${productLink}`;

            console.log(captcha_url);
            const puppeteer = require("puppeteer");
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://example.com");
            await page.screenshot({ path: "example.png" });

            const captchaLink = error.response.data["url"];
            console.log("Solve Captcha...", captchaLink);
            await browser.close();
        }
        */
        console.log("Add to cart failed", error.response.status);
        throw error;
    }
}

async function setEmail(tokens) {
    const headers = {
        referer: "https://www.footlocker.ca/en/checkout",
        cookie: `${tokens.jsessionid}${tokens.cartguid}`,
        "x-csrf-token": tokens.csrf,
    };

    const response = await axiosSession.put(
        `/users/carts/current/email/${user.email}`,
        {},
        { headers: headers }
    );

    console.log("Setting Email OK... ", response.status);
}

async function setShipping(tokens) {
    const headers = {
        referer: "https://www.footlocker.ca/en/checkout",
        cookie: `${tokens.jsessionid}${tokens.cartguid}`,
        "x-csrf-token": tokens.csrf,
    };

    const body = {
        shippingAddress: {
            setAsDefaultBilling: false,
            setAsDefaultShipping: false,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            country: {
                isocode: user.country.isocode,
                name: user.country.name,
            },
            firstName: user.firstName,
            billingAddress: false,
            defaultAddress: false,
            id: null,
            line1: user.address,
            postalCode: user.postalCode,
            region: {
                countryIso: user.region.countryIso,
                isocode: user.region.isocode,
                isocodeShort: user.region.isocodeShort,
                name: user.region.name,
            },
            setAsBilling: true,
            shippingAddress: true,
            town: user.town,
            visibleInAddressBook: false,
            type: "default",
            LoqateSearch: "",
        },
    };

    const response = await axiosSession.post(
        "/users/carts/current/addresses/shipping",
        body,
        { headers: headers }
    );

    console.log("Setting Shipping OK... ", response.status);
}

async function setBilling(tokens) {
    const headers = {
        referer: "https://www.footlocker.ca/en/checkout",
        cookie: `${tokens.jsessionid}${tokens.cartguid}`,
        "x-csrf-token": tokens.csrf,
    };

    const body = {
        setAsDefaultBilling: false,
        setAsDefaultShipping: false,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        country: { isocode: user.country.isocode, name: user.country.name },
        firstName: user.firstName,
        billingAddress: false,
        defaultAddress: false,
        id: null,
        line1: user.address,
        postalCode: user.postalCode,
        region: {
            countryIso: user.region.countryIso,
            isocode: user.region.isocode,
            isocodeShort: user.region.isocodeShort,
            name: user.region.name,
        },
        setAsBilling: false,
        shippingAddress: true,
        town: user.town,
        visibleInAddressBook: false,
        type: "default",
        LoqateSearch: "",
    };

    const response = await axiosSession.post(
        "/users/carts/current/set-billing",
        body,
        { headers: headers }
    );

    console.log("Setting Billing OK... ", response.status);
}

async function encrypt() {
    const genTime = new Date().toISOString();
    const cse = global.adyen.encrypt.createEncryption(adyen_key, {});

    const month = cse.encrypt({
        expiryMonth: process.env.MONTH,
        generationtime: genTime,
    });
    const year = cse.encrypt({
        expiryYear: process.env.YEAR,
        generationtime: genTime,
    });
    const number = cse.encrypt({
        number: process.env.NUMBER,
        generationtime: genTime,
    });
    const cvc = cse.encrypt({ cvc: process.env.CVC, generationtime: genTime });

    return { number, month, year, cvc };
}

async function placeOrder(tokens, device_id) {
    const headers = {
        referer: "https://www.footlocker.ca/en/checkout",
        cookie: `${tokens.jsessionid}${tokens.cartguid}`,
        "x-csrf-token": tokens.csrf,
    };

    const { number, month, year, cvc } = await encrypt();

    const body = {
        preferredLanguage: "en",
        termsAndCondition: false,
        deviceId: device_id,
        encryptedCardNumber: number,
        encryptedExpiryMonth: month,
        encryptedExpiryYear: year,
        encryptedSecurityCode: cvc,
        paymentMethod: "CREDITCARD",
        returnUrl: "https://www.footlocker.ca/adyen/checkout",
        browserInfo: {
            screenWidth: 1920,
            screenHeight: 1080,
            colorDepth: 24,
            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.3=",
            timeZoneOffset: 300,
            language: "en-CA",
            javaEnabled: false,
        },
    };

    const response = await axiosSession.post("/v2/users/orders", body, {
        headers: headers,
    });

    console.log("Place Order !", response.status);
}

function generateDeviceId() {
    let data = ioGetBlackbox();
    return data.blackbox;
}

async function main() {
    const delay = (await promptDelay()) * 1000;
    //eslint-disable-next-line
    while (true) {
        try {
            const device_id = generateDeviceId();

            // const productInfo = await promptProduct();
            console.log("Init Session...");
            const tokens = await instanciateSession();

            console.log("Looking for in stock sneakers...");
            const products = await getProductsCode("6161123");

            const { code } = await promptProductSize(products);
            console.log("Adding product to cart...");

            tokens.cartguid = await addToCart(
                code,
                "https://www.footlocker.ca/en/product/nike-air-max-90-boys-toddler/6161123.html",
                tokens
            );

            console.log("Setting Email...");
            await setEmail(tokens);

            console.log("Setting Shipping Info...");
            await setShipping(tokens);

            console.log("Setting Billing Info...");
            await setBilling(tokens);

            console.log("Placing order...");
            await placeOrder(tokens, device_id);

            console.log("Sleeping...");
            await new Promise((r) => setTimeout(r, delay));
        } catch (err) {
            console.log("Checkout failed...", err.response.status);

            console.log("Sleeping...");
            await new Promise((r) => setTimeout(r, delay));
        }
    }
}

(async () => {
    await main();
})();
