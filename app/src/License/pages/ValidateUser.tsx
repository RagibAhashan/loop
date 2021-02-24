import { Progress, Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
    const [prog, setProg] = useState(0);
    const [validated, setValidated] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        // setTimeout(() => {
        //     ipcRenderer.invoke('GET-SYSTEM-ID').then((SYSTEM_KEY) => {
        //         axios
        //             .post('http://localhost:4000/user/log', {
        //                 SYSTEM_KEY: SYSTEM_KEY,
        //                 isLogIn: true,
        //             })
        //             .then((res) => console.log(res))
        //             .catch((error) => console.log(error));

        //         axios
        //             .post('http://localhost:4000/user/validateSystem', {
        //                 SYSTEM_KEY: SYSTEM_KEY,
        //             })
        //             .then(() => {
        //                 setValidated((prev) => (prev = true));
        //                 setTimeout(() => {
        //                     history.push(PROFILE_ROUTE);
        //                 }, 500);
        //             })
        //             .catch((error) => {
        //                 setFailed((prev) => (prev = true));
        //                 setTimeout(() => {
        //                     history.push(ACTIVATE_LICENSE_ROUTE);
        //                 }, 500);
        //             });
        //     });
        // }, 2700);
        history.push(PROFILE_ROUTE);

        setTimeout(() => {
            setProg((prev) => (prev = 25));
        }, 800);

        setTimeout(() => {
            setProg((prev) => (prev = 40));
        }, 1000);

        setTimeout(() => {
            setProg((prev) => (prev = 75));
        }, 1500);

        setTimeout(() => {
            setProg((prev) => (prev = 90));
        }, 2300);

        setTimeout(() => {
            setProg((prev) => (prev = 100));
        }, 2500);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ backgroundColor: 'white' }}>
                <img src={smokey} alt="circle" style={{ height: '20vh' }} />
            </div>

            <div style={{ width: '25vh' }}>
                {failed ? (
                    <Progress
                        strokeColor={{
                            '0%': '#ff3300',
                            '100%': '#ff3300',
                        }}
                        percent={prog}
                        showInfo={false}
                        status="active"
                    />
                ) : (
                    <Progress
                        strokeColor={
                            validated
                                ? {
                                      '0%': '#b8ff66',
                                      '100%': '#b8ff66',
                                  }
                                : {
                                      '0%': '#0f0f0f',
                                      '100%': '#ffffff',
                                  }
                        }
                        percent={prog}
                        showInfo={false}
                        status="active"
                    />
                )}
                <br />
            </div>
        </div>
    );
};

export default ValidateUserComponent;
