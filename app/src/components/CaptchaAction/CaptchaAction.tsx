import { Button } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { buttonStyle } from '../../styles/Buttons';
/*
This component renders the captcha button for a store and manages the captcha queue
*/
const CaptchaAction = (props: any) => {
    // const { storeKey } = props;
    // const dispatch = useDispatch();

    // const captchaWinOpened = useSelector((state: AppState) => isCaptchaWindowOpen(state, storeKey));
    const captchaWinOpened = false;

    // const listenCaptcha = () => {
    //     window.ElectronBridge.on(NOTIFY_CAPTCHA_STORE(storeKey), (event, captcha: Captcha) => {
    //         // store tasks with captcha in localstorage
    //         dispatch(addCaptchaToQueue({ storeKey: storeKey, captcha: captcha }));

    //         // notifications in captcha button or open captcha windopw
    //         if (!captchaWinOpened) {
    //             openCaptcha();
    //         }
    //     });
    // };

    const openCaptcha = async () => {
        // window.ElectronBridge.send(CAPTHA_WINDOW_OPEN, storeKey);
        // dispatch(openCaptchaWindow({ storeKey }));
    };

    // useEffect(() => {
    //     console.log('captch actoin refreshed', captchaWinOpened);
    //     window.ElectronBridge.on(CAPTHA_WINDOW_CLOSED(storeKey), () => {
    //         console.log('got closing captcha window for store', storeKey);
    //         dispatch(closeCaptchaWindow({ storeKey }));
    //     });
    //     listenCaptcha();
    //     return () => {
    //         window.ElectronBridge.removeAllListeners(CAPTHA_WINDOW_CLOSED(storeKey));
    //         window.ElectronBridge.removeAllListeners(NOTIFY_CAPTCHA_STORE(storeKey));
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <Button style={buttonStyle} type="primary" onClick={() => openCaptcha()} disabled={captchaWinOpened}>
            Captcha
        </Button>
    );
};

CaptchaAction.propTypes = {
    storeKey: PropTypes.string.isRequired,
};

export default CaptchaAction;
