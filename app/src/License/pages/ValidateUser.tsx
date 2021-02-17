import { Spin } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import { PROFILE_ROUTE, ACTIVATE_LICENSE_ROUTE, VALIDATE_USER_DATA_ROUTE } from '../../common/Constants';

const { ipcRenderer } = window.require('electron');
const smokey = 'https://cdn.dribbble.com/users/1106178/screenshots/4175222/orb.gif';
const pink = 'https://cdn.dribbble.com/users/1106178/screenshots/4211140/circle.gif';
const whitey = 'https://thumbs.gfycat.com/DearWellinformedDalmatian-size_restricted.gif';
const blackey = 'http://static.demilked.com/wp-content/uploads/2016/06/gif-animations-replace-loading-screen-2.gif';
const redey = 'https://cdn.dribbble.com/users/1417337/screenshots/5750630/bubble-loader.gif';
const spiraley = 'https://i.gifer.com/1etH.gif';
const ValidateUserComponent = (props: any) => {
    const { history } = props;
    useEffect(() => {
        setTimeout(() => {
            ipcRenderer.invoke('GET-SYSTEM-ID').then((SYSTEM_KEY) => {
                axios
                    .post('http://localhost:4000/user/validateSystem', {
                        SYSTEM_KEY: SYSTEM_KEY,
                    })
                    .then(() => {
                        history.push(PROFILE_ROUTE);
                    })
                    .catch((error) => {
                        history.push(ACTIVATE_LICENSE_ROUTE);
                    });
            });
        }, 2500);
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <img title="loading" src={pink} alt="circle" style={{ height: '75vh' }} />
        </div>
    );
};

export default ValidateUserComponent;
