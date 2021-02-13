import React, { useEffect } from 'react';
import { ICaptcha } from './CaptchaFrame';

const Captcha = (props: any) => {
    const { captcha }: { captcha: ICaptcha } = props;

    useEffect(() => {}, []);

    return (
        <div style={{ borderBottom: '1px solid grey', padding: 10 }}>
            <iframe title={captcha.uuid} width="360" height="200" scrolling="no" sandbox="allow-scripts allow-same-origin" src={captcha.url}></iframe>
        </div>
    );
};

export default Captcha;
