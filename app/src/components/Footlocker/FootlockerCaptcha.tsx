import { Button } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CAPTHA_WINDOW_CLOSED, CAPTHA_WINDOW_OPEN, NOTIFY_CAPTCHA_STORE } from '../../common/Constants';
import { Captcha } from '../../interfaces/TaskInterfaces';
import { addCaptchaToQueue } from '../../services/Store/StoreService';
import { buttonStyle } from '../../styles/Buttons';
/*
This component renders the captcha button for the walmart store and manages the captcha queue
*/
const FootlockerCaptcha = (props: any) => {
    const { storeKey } = props;
    const dispatch = useDispatch();
    const [captchaWinOpened, setCaptchaWinOpened] = useState(false);

    const listenCaptcha = () => {
        window.ElectronBridge.on(NOTIFY_CAPTCHA_STORE(storeKey), (event, captcha: Captcha) => {
            // store tasks with captcha in localstorage
            dispatch(addCaptchaToQueue({ storeKey: storeKey, captcha: captcha }));

            // and then open window or
            // if (!captchaWinOpened) {
            //     console.log('got captcha');
            //     openCaptcha();
            // }
        });
    };

    const openCaptcha = async () => {
        window.ElectronBridge.send(CAPTHA_WINDOW_OPEN, storeKey);
        setCaptchaWinOpened(true);
    };

    useEffect(() => {
        window.ElectronBridge.on(CAPTHA_WINDOW_CLOSED, () => {
            setCaptchaWinOpened(false);
        });
        listenCaptcha();
        return () => {
            window.ElectronBridge.removeAllListeners(CAPTHA_WINDOW_CLOSED);
            window.ElectronBridge.removeAllListeners(NOTIFY_CAPTCHA_STORE(storeKey));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Button style={buttonStyle} type="primary" onClick={() => openCaptcha()} disabled={captchaWinOpened}>
            Captcha
        </Button>
    );
};

FootlockerCaptcha.propTypes = {
    storeKey: PropTypes.string.isRequired,
};

export default FootlockerCaptcha;
