import React, { useEffect } from 'react';
import { SET_PROXY_CAPTCHA_WINDOW } from '../common/Constants';
import { StoreType } from '../constants/stores';
import { Captcha, PxCaptcha } from '../interfaces/TaskInterfaces';

/*
This components render the actual captcha to be solved by user
*/
const PXCaptcha = (props: any) => {
    const { storeKey, captcha }: { storeKey: StoreType; captcha: Captcha } = props;
    const { appId, blockScript, jsClientSrc, firstPartyEnabled, vid, uuid, hostUrl } = captcha.params as PxCaptcha;

    const blockScriptTag = document.getElementById('blockScript') as HTMLScriptElement;

    // This function name is defined my PX captcha
    // reference : https://github.com/PerimeterX/perimeterx-abr-react-demo-app
    const _pxOnCaptchaSuccess = (isValid: boolean) => {
        console.log('captcha is valid ?', isValid);
    };

    const setPxVariables = () => {
        (window as any)._pxAppId = appId;
        (window as any)._pxJsClientSrc = 'https://www.walmart.com' + jsClientSrc;
        (window as any)._pxFirstPartyEnabled = firstPartyEnabled;
        (window as any)._pxVid = vid;
        (window as any)._pxUuid = uuid;
        (window as any)._pxHostUrl = 'https://www.walmart.com' + hostUrl;
        blockScriptTag.src = 'https://www.walmart.com' + blockScript;
    };

    // const currentTask = useSelector((state: AppState) => getTaskById(state, storeKey, captcha.taskUUID));

    const setProxy = () => {
        window.ElectronBridge.send(SET_PROXY_CAPTCHA_WINDOW, storeKey, 'localhost');
    };

    useEffect(() => {
        console.log('rendering captcha frame');
        (window as any)._pxOnCaptchaSuccess = _pxOnCaptchaSuccess;
        setPxVariables();

        // setProxy();
    });

    return (
        <div id="challenge-div">
            <div id="px-captcha">{/* <script src={blockScript}></script> */}</div>
        </div>
    );
};

export default PXCaptcha;
