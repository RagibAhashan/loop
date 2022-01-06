import React, { useEffect, useState } from 'react';
import { STORE_KEY } from '../common/Constants';
import { STORES, StoreType } from '../constants/Stores';
import { debug } from '../core/log';
import { Captcha } from '../interfaces/TaskInterfaces';

const log = debug.extend('PXCaptcha');

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
    const [storeKey, setStoreKey] = useState<StoreType>();

    // const nextCaptcha = (): Captcha => {
    //     console.log('catcpa queue before', captchaQueue);
    //     const captcha = captchaQueue.shift();
    //     console.log('catcpa queue after pop', captchaQueue);
    //     dispatch(updateCaptchaQueue({ storeKey: storeKey, captchaQueue: captchaQueue }));
    //     return captcha;
    // };

    const nextCaptcha = (): Captcha => {
        return {
            params: {
                redirectUrl: '/blocked?url=L2NoZWNrb3V0L3Jldmlldy1vcmRlcg==&uuid=187eda63-2637-11ec-bede-55485a596946&vid=&g=b',
                appId: 'PXu6b0qd2S',
                jsClientSrc: '/px/PXu6b0qd2S/init.js',
                firstPartyEnabled: true,
                vid: '',
                uuid: '187eda63-2637-11ec-bede-55485a596946',
                hostUrl: '/px/PXu6b0qd2S/xhr',
                blockScript: '/px/PXu6b0qd2S/captcha/captcha.js?a=c&m=0&u=187eda63-2637-11ec-bede-55485a596946&v=&g=b',
            },
            taskUUID: '123',
        };
    };

    const _pxOnCaptchaSuccess = (isValid: boolean) => {
        console.log('captcha is valid ?', isValid);
    };

    useEffect(() => {
        console.log('render frame');
        window.ElectronBridge.on(STORE_KEY, (event, storeKey: StoreType) => {
            console.log('got storekey', storeKey);
            setStoreKey(storeKey);
            const store = STORES[storeKey];
            console.log(storeKey, store.url);
            // (window as any).origin = store.url;
            // (window as any).location.origin = store.url;
            // Object.assign(window.location, {});

            // window.location.assign('https://www.walmart.com/px/PXu6b0qd2S/captcha/captcha.js?a=c&m=0&u=abc004ee-24aa-11ec-944e-684f6c767753&v=&g=b');

            // Object.defineProperty(window, 'location', { value: { origin: store.url }, writable: true, configurable: true });
            // Object.assign(window.location, { origin: store.url });
        });

        (window as any)._pxOnCaptchaSuccess = _pxOnCaptchaSuccess;

        return () => {
            window.ElectronBridge.removeAllListeners(STORE_KEY);
        };
    }, []);

    return (
        <div>
            <iframe
                src="https://www.walmart.com/blocked?url=L2lwL0dyZWF0LVZhbHVlLUFsbW9uZC1Td2VldC1TYWx0eS1DaGV3eS1HcmFub2xhLUJhcnMtMS0yMy1vei02LWNvdW50LzEwODk4NzU0&uuid=da284d40-2656-11ec-a5da-abb6076cdffe&vid=da9aef1b-2656-11ec-97f6-5062704f4d79&g=b"
                height="600"
                sandbox="allow-same-origin allow-scripts"
                referrerPolicy="no-referrer"
            ></iframe>
            {/* <PXCaptcha storeKey={storeKey} captcha={nextCaptcha()}></PXCaptcha> */}
        </div>
    );
};

export default CaptchaFrame;
