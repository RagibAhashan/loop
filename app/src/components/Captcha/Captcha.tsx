import React, { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { GET_DATADOME } from '../../common/Constants';
import { ICaptcha } from './CaptchaFrame';
const { ipcRenderer } = window.require('electron');

const Captcha = (props: any) => {
    const { siteKey, solved, captcha }: { siteKey: string; solved: any; captcha: ICaptcha } = props;

    useEffect(() => {
        console.log('site', siteKey);
    });
    const onSolveCap = async (token: string | null) => {
        console.log('solved', token);
        const datadome = await ipcRenderer.invoke(GET_DATADOME, token, captcha);
        console.log('got datadome cookie', datadome);
        solved(datadome);
    };

    return (
        <div>
            <ReCAPTCHA sitekey={siteKey} onChange={onSolveCap} />
        </div>
    );
};

export default Captcha;
