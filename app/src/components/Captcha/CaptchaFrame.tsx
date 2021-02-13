import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NOTIFY_CAPTCHA } from '../../common/Constants';
import { taskService } from '../../services/TaskService';
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
} as React.CSSProperties;
const CaptchaFrame = () => {
    const { store } = useParams() as any;
    const [captchaQ, setCaptchaQ] = useState<ICaptcha[]>([]);

    const removeFromQueue = (captchaToRemove: ICaptcha) => {
        setCaptchaQ((prev) => prev.filter((captcha) => captcha.uuid !== captchaToRemove.uuid));
    };
    useEffect(() => {
        ipcRenderer.on(store + NOTIFY_CAPTCHA, (e, captcha: ICaptcha) => {
            setCaptchaQ((prevQ) => [...prevQ, captcha]);
        });

        fetchCaptchas();

        return () => {
            ipcRenderer.removeAllListeners(store + NOTIFY_CAPTCHA);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCaptchas = () => {
        const capArray = taskService.dispatchCaptchas();

        setCaptchaQ((prevQ) => [...prevQ, ...capArray]);
    };

    return (
        <div key={store} style={containerStyle}>
            <div style={captchaContainer}>
                {captchaQ.map((captcha) => (
                    <Captcha key={captcha.uuid} captcha={captcha} removeMe={removeFromQueue} />
                ))}
            </div>
        </div>
    );
};

export default CaptchaFrame;
