import React, { useEffect } from 'react';
import { ICaptcha } from './CaptchaFrame';

const Captcha = (props: any) => {
    const { captcha }: { captcha: ICaptcha } = props;

    useEffect(() => {}, []);

    return (
        <div style={{ borderBottom: '1px solid grey', padding: 10 }}>
            <span> {captcha.url}</span>
            <span> {captcha.uuid}</span>
        </div>
    );
};

export default Captcha;
