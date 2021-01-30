import React, { useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

const containerStyle = {
    backgroundColor: '#212427',
    width: '100vw',
    height: '100vh',
};
const CaptchaFrame = () => {
    useEffect(() => {
        ipcRenderer.on('captcha', () => {});
    }, []);

    return <div style={containerStyle}>allo this is a captcha frame</div>;
};

export default CaptchaFrame;
