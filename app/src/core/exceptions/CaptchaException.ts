export class CaptchaException extends Error {
    // Expected store response from captcha request
    response: any;

    constructor(message: string, response: any) {
        super(message);
        this.response = response;
    }
}
