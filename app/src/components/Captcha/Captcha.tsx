import React, { useEffect } from 'react';
import { NOTIFY_CAPTCHA_SOLVED } from '../../common/Constants';
import { ICaptcha } from './CaptchaFrame';
const { ipcRenderer } = window.require('electron');

const Captcha = (props: any) => {
    const { captcha, removeMe }: { captcha: ICaptcha; removeMe: any } = props;

    useEffect(() => {
        window.addEventListener(
            'message',
            (event) => {
                removeMe(captcha);
                const datadome = JSON.parse(event.data).cookie;
                console.log('got datadome cookie', datadome);
                ipcRenderer.send(NOTIFY_CAPTCHA_SOLVED, captcha.uuid, datadome);
            },
            false,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            style={{
                margin: 10,
                width: 320,
                height: 520,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <iframe
                title={captcha.uuid}
                style={{ position: 'absolute', left: -20, top: -0 }}
                width="360"
                height="520"
                scrolling="no"
                sandbox="allow-scripts allow-same-origin"
                src={captcha.url}
            ></iframe>
        </div>
    );
};

export default Captcha;
