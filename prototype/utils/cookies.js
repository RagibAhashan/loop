/**
 * Return a cookie value from its name
 *
 * @return {string} cookie value
 *
 */
function extract(cookies, cookieName) {
    let regex = new RegExp(`${cookieName}=([^;]*)`);
    let match = regex.exec(cookies);

    return match[1];
}

module.exports = { extract };
