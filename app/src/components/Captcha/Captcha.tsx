import React, { useEffect } from 'react';
import { GET_DATADOME } from '../../common/Constants';
import { ICaptcha } from './CaptchaFrame';
const { ipcRenderer } = window.require('electron');

const Captcha = (props: any) => {
    const { siteKey, solved, captcha }: { siteKey: string; solved: any; captcha: ICaptcha } = props;

    useEffect(() => {
        console.log('site', siteKey);
    });
    const onSolveCap = async (token: string) => {
        console.log('solved', token);
        const datadome = await ipcRenderer.invoke(GET_DATADOME, token, captcha);
        console.log('got datadome cookie', datadome);
        solved(datadome);
    };

    (window as any).onSolveCap = onSolveCap;

    return (
        <div>
            <form action="?" method="POST">
                <div className="g-recaptcha" data-sitekey={siteKey} data-callback="onSolveCap"></div>
            </form>
        </div>
    );
};

export default Captcha;
