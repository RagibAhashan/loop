// const EncryptWalmart = require('./scripts/WalmartEncryption');
const axios = require('axios');
const { curly } = require('node-libcurl');
const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">Hello world</h2>');
const tough = require('tough-cookie');
const Cookie = tough.Cookie;
const cookieParser = require('cookie');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const m = async () => {
    try {
        const h = {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-CA,en;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            credentials: 'include',
            omitcorrelationid: 'true',
            omitcsrfjwt: 'true',
            origin: 'https://www.walmart.com',
            pragma: 'no-cache',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36',
        };

        const body = {
            quantity: 1,
            actionType: 'INCREASE',
            customAttributes: [
                {
                    type: 'NON_DISPLAY',
                    name: 'pita',
                    value: 0,
                },
            ],
            location: {
                postalCode: '94066',
                city: 'San Bruno',
                state: 'CA',
                isZipLocated: false,
            },
            storeIds: [2648, 5434, 2031, 2280, 5426],
            offerId: '6E2F166992F142839322C8B6883ADC58',
        };
        const url = new URL('https://www.walmart.com/api/v3/cart/lite/guest/:CID/items');

        const t = await axios.post(url.toString(), body, { headers: h });
        console.log('FIRST ', t);

        const cookieJar = new tough.CookieJar();
        // let cookies = headers['set-cookie'].map(Cookie.parse);

        // for (let cook of cookies) {
        //     const addedCook = await cookieJar.setCookie(cook, 'https://www.walmart.com/', { ignoreError: true });
        //     if (addedCook) {
        //         console.log('ADDED', addedCook.creation);
        //     }
        // }
        // const sec = 'https://securedataweb.walmart.com/pie/v1/wmcom_us_vtg_pie/getkey.js?bust=1623718169416';

        // console.log('COOKIE SESSION FOR WALMART', cookieJar.getCookiesSync(url.toString()));
        // console.log('COOKIE SESSION FOR GETKEYJS', cookieJar.getCookieStringSync(sec));
        // console.log(tough.domainMatch(url.toString(), '.www.walmart.com'));
        // console.log(tough.pathMatch(url.toString(), '/ip/123'));
        // const $ = cheerio.load(t.data);
        // const item = $('#item');
        // console.log('ITEM', JSON.parse('not valid {} []'));
        // const { statusCode, data, headers } = await curly.get('www.walmart.com');
        // console.log(statusCode, headers);

        // console.log(cookieJar.getCookieStringSync('https://www.walmart.com') === ' ');
    } catch (e) {
        if (e instanceof TypeError) {
            console.log('type error');
        }
        console.log('ERROOOR', e);
    }
};

const test = async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();

        await page.goto(
            'https://walmart.com/ip/9-8FT-LED-Fairy-Starry-Copper-Wire-String-Battery-Operated-Powered-Waterproof-Light-Strip-for-Holiday-Decor/163028359',
        );

        const cookies = await page.cookies();

        console.log(cookies[0]);
        const cookie1 = cookies[0];
        const strCooki = cookieParser.serialize(cookie1.name, cookie1.value, {
            domain: cookie1.domain,
            expires: new Date(cookie1.expires),
            httpOnly: cookie1.httpOnly,
            maxAge: cookie1.maxAge,
            path: cookie1.path,
            sameSite: cookie1.sameSite,
            secure: cookie1.secure,
        });

        console.log(strCooki);
        const touchcookie1 = tough.Cookie.parse(strCooki);

        console.log('tough cookie', touchcookie1, touchcookie1.key, touchcookie1.value);
        // const resp = await axios.get('https://www.walmart.com');
        // console.log(resp.response.headers);
        await browser.close();
    } catch (e) {
        if (e.response) {
            console.log('catch error', e.response.headers);
        } else {
            console.log('error', e);
        }
    }
};
test();
// m();
