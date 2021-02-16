import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NOTIFY_CAPTCHA, NOTIFY_CAPTCHA_SOLVED } from '../../common/Constants';
import Captcha from './Captcha';
const { ipcRenderer } = window.require('electron');

export interface ICaptcha {
    url: string;
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
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
} as React.CSSProperties;

const CaptchaFrame = () => {
    const dispatchCaptcha = (): ICaptcha | undefined => {
        console.log('dispatching');
        const currentCaptcha = JSON.parse(localStorage.getItem('currentCaptcha') as string) as ICaptcha[];
        if (!currentCaptcha) return undefined;

        return currentCaptcha.shift();
    };

    const { store } = useParams() as any;
    const [currentCaptcha, setCurrentCaptcha] = useState<ICaptcha | undefined>(() => dispatchCaptcha());

    useEffect(() => {
        console.log('init use effect');
        ipcRenderer.on(store + NOTIFY_CAPTCHA, (event, captcha: ICaptcha) => {
            console.log('got captcha in window', currentCaptcha);

            if (!currentCaptcha) {
                console.log('setting');

                // console.log('received cap');
                setCurrentCaptcha(captcha);
            }
        });

        return () => {
            ipcRenderer.removeAllListeners(store + NOTIFY_CAPTCHA);
            ipcRenderer.removeAllListeners(currentCaptcha?.uuid + NOTIFY_CAPTCHA);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const solved = (datadome: string) => {
        console.log('solved that bitch');
        // for the moment just clear the queue, we are assuming all captchas are solved from only one
        setCurrentCaptcha(undefined);
        const captchas = JSON.parse(localStorage.getItem('currentCaptcha') as string) as ICaptcha[];
        captchas?.forEach((captcha) => ipcRenderer.send(NOTIFY_CAPTCHA_SOLVED, captcha.uuid, datadome));
        localStorage.removeItem('currentCaptcha');
    };

    const renderCaptcha = () => {
        console.log('rerendering', currentCaptcha);
        return currentCaptcha ? (
            <Captcha key={currentCaptcha.uuid} captcha={currentCaptcha} solved={solved}></Captcha>
        ) : (
            <div>
                <Spin />
            </div>
        );
        // const capArray = taskService.dispatchCaptchas();
        // setCaptchaQ((prevQ) => [...prevQ, ...capArray]);
    };

    return (
        <div key={store} style={containerStyle}>
            <div style={captchaContainer}>{renderCaptcha()}</div>
        </div>
    );
};

export default CaptchaFrame;
