import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NOTIFY_CAPTCHA, NOTIFY_CAPTCHA_SOLVED } from '../../common/Constants';
import { STORES, StoreType } from '../../constants/Stores';
import Captcha from './Captcha';
const { ipcRenderer } = window.require('electron');

export interface ICaptcha {
    params: { [key: string]: string };
    uuid: string;
}

const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#212427',
    overflow: 'auto',
} as React.CSSProperties;

const captchaContainer = {
    height: '100%',
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'center',
    // alignItems: 'center',
} as React.CSSProperties;

const CaptchaFrame = () => {
    const { store } = useParams() as any;

    const dispatchCaptcha = (): undefined | ICaptcha => {
        const captchas = JSON.parse(localStorage.getItem(store + NOTIFY_CAPTCHA) as string) as ICaptcha[];
        if (!captchas) return undefined;

        console.log('dispatching', captchas[0]);
        return captchas[0];
    };

    const [solvingCaptcha, setSolvingCaptcha] = useState<undefined | ICaptcha>(() => dispatchCaptcha());
    const siteKey = STORES[store as StoreType].siteKey;

    useEffect(() => {
        console.log('init use effect', siteKey);
        ipcRenderer.on(store + NOTIFY_CAPTCHA, (event, captcha) => {
            console.log('got captcha in window', solvingCaptcha, captcha);
            if (!solvingCaptcha) {
                setSolvingCaptcha(captcha);
            }
        });

        return () => {
            ipcRenderer.removeAllListeners(store + NOTIFY_CAPTCHA);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const solved = (datadome: string) => {
        // for the moment just clear the queue, we are assuming all captchas are solved from only one
        const captchas = JSON.parse(localStorage.getItem(store + NOTIFY_CAPTCHA) as string) as ICaptcha[];
        console.log('solved that bitch', captchas);
        captchas?.forEach((captcha) => {
            console.log('sending to ', captcha.uuid);
            ipcRenderer.send(NOTIFY_CAPTCHA_SOLVED, captcha.uuid, datadome);
        });
        localStorage.removeItem(store + NOTIFY_CAPTCHA);
        setSolvingCaptcha(undefined);
    };

    const renderCaptcha = () => {
        console.log('rendering', solvingCaptcha);
        return solvingCaptcha ? (
            <Captcha siteKey={siteKey} solved={solved} captcha={solvingCaptcha}></Captcha>
        ) : (
            <div>
                <Spin />
            </div>
        );
    };

    return (
        <div key={store} style={containerStyle}>
            <div style={captchaContainer}>{renderCaptcha()}</div>
        </div>
    );
};

export default CaptchaFrame;
