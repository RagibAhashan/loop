const axios = require("axios").default;
const API = "https://www.footlocker.ca/api";
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
const user = require("./info.json");
const puppeteer = require("puppeteer");
// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// puppeteer.use(StealthPlugin());
const httpsProxyAgent = require("https-proxy-agent");

// Client side script
require("browser-env")();
require("./scripts/2615645779051917");
const { adyen_key } = require("./scripts/keys");
const cookie_utils = require("./utils/cookies");
const ioGetBlackbox = require("./scripts/snare");

/*
These are some headers shared with requests to avoid bot detection
I have tested it without most of the headers and it still works ?
I am not sure if they are really needed, but lets keep them just in case
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
    // httpsAgent: new httpsProxyAgent("http://8.210.9.252:8118"),
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

    const cookies = response.headers["set-cookie"].join();
    const JSESSIONID = cookie_utils.extract(cookies, "JSESSIONID");
    const csrfToken = response.data["data"]["csrfToken"];

    const tokens = {
        jsessionid: JSESSIONID,
        csrf: csrfToken,
        cartguid: "",
    };

    console.log("Session Init OK... ", response.status, tokens);

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
    let added = false;
    let datadome = undefined;
    while (!added) {
        try {
            console.log("trying to add");
            const headers = {
                referer: productLink,
                cookie: `JSESSIONID=${tokens.jsessionid}`,
                "x-fl-productid": code,
                "x-csrf-token": tokens.csrf,
            };

            if (datadome) {
                headers.cookie = `${headers.cookie};datadome=${datadome}`;
                console.log("TRYING AGAIN BUT WITH DATADOME", headers.cookie);
            }

            console.log(headers);

            const body = { productQuantity: "1", productId: code };

            const response = await axiosSession.post(
                "/users/carts/current/entries",
                body,
                { headers: headers }
            );

            console.log("getting cookies");
            const cookies = response.headers["set-cookie"].join();
            console.log("COOKIES", cookies);

            console.log("Adding to cart OK... ", response.status);
            added = true;
            const cart_guid = cookie_utils.extract(cookies, "cart-guid");
            console.log("CARt GUID", cart_guid);
            return cart_guid;
        } catch (error) {
            // TODO WIP Captcha
            if (error.response && "url" in error.response.data) {
                console.log("trying to solve captcha");
                const cookies = error.response.headers["set-cookie"][0];
                const capDatadome = cookie_utils.extract(cookies, "datadome");
                const captcha_url = `${error.response.data["url"]}&cid=${capDatadome}&referer=${productLink}`;

                console.log(captcha_url);
                const browser = await puppeteer.launch({
                    headless: false,
                    defaultViewport: null,
                });
                const page = await browser.newPage();

                page.on("response", async (res) => {
                    if (
                        res
                            .url()
                            .startsWith(
                                "https://geo.captcha-delivery.com/captcha/check?"
                            )
                    ) {
                        console.log("getting new datadome cookie !");
                        const cookie = await res.json();
                        datadome = cookie_utils.extract(
                            cookie["cookie"],
                            "datadome"
                        );
                        console.log(
                            "datadome cookie found !, closing browser...",
                            datadome
                        );
                    }
                });

                await page.setExtraHTTPHeaders({
                    referer: "https://www.footlocker.ca/",
                });

                await page.setUserAgent(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.3="
                );

                await page.goto(captcha_url);

                await page.waitForNavigation({
                    waitUntil: "networkidle2",
                    timeout: 0,
                });

                if (!datadome) console.log("datadome cookie not found !");
                await browser.close();
            } else {
                console.log("Add to cart failed", error.response.status);
                throw error;
            }
        }
    }
}

async function setEmail(tokens) {
    const headers = {
        referer: "https://www.footlocker.ca/en/checkout",
        cookie: `JSESSIONID=${tokens.jsessionid};cart-guid=${tokens.cartguid}`,
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
        cookie: `JSESSIONID=${tokens.jsessionid};cart-guid=${tokens.cartguid}`,
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
        cookie: `JSESSIONID=${tokens.jsessionid};cart-guid=${tokens.cartguid}`,
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
        cookie: `JSESSIONID=${tokens.jsessionid};cart-guid=${tokens.cartguid}`,
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
    const device_id = generateDeviceId();

    //eslint-disable-next-line
    while (true) {
        try {
            // const productInfo = await promptProduct();
            console.log("Init Session...");
            const tokens = await instanciateSession();
            console.log("Looking for in stock sneakers...");
            const products = await getProductsCode("4103872");
            // const { code } = await promptProductSize(products);
            console.log("Adding product to cart...");
            tokens.cartguid = await addToCart(
                "20439034",
                "https://www.footlocker.ca/en/product/nike-air-force-1-low-mens/4103872.html",
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
            if (err.response) {
                console.log("Checkout failed...", err.response.status);
            } else {
                console.log(err);
            }

            console.log("Sleeping...");
            await new Promise((r) => setTimeout(r, delay));
        }
    }
}

(async () => {
    await main();
})();
