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
    backgroundColor: '#212427',
    width: '100vw',
    height: '100vh',
};
const CaptchaFrame = () => {
    const { store } = useParams() as any;
    const [captchaQ, setCaptchaQ] = useState<ICaptcha[]>([]);

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
            {captchaQ.map((captcha) => (
                <Captcha captcha={captcha} />
            ))}
        </div>
    );
};

export default CaptchaFrame;
