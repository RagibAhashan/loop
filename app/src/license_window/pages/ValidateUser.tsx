import { Button, Progress } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ACCESS_GRANTED, ACTIVATE_LICENSE_ROUTE, GET_SYSTEM_ID, SERVER_ENDPOINT } from '../../common/Constants';

const smokey = 'https://cdn.dribbble.com/users/1106178/screenshots/4175222/orb.gif';

const ValidateUserComponent = (props: any) => {
    const { history } = props;
    const [prog, setProg] = useState(0);
    const [validated] = useState(false);
    const [failed] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            window.ElectronBridge.invoke(GET_SYSTEM_ID).then((SYSTEM_KEY) => {
                console.log('SYSTEM_KEY', SYSTEM_KEY);
                axios
                    .get(`${SERVER_ENDPOINT}/botAuth/${SYSTEM_KEY}`)
                    .then((res) => {
                        window.ElectronBridge.send(ACCESS_GRANTED);
                    })
                    .catch((error) => {
                        history.push(ACTIVATE_LICENSE_ROUTE);
                    });
            });
        }, 2700);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Button danger={true} onClick={() => window.ElectronBridge.send(ACCESS_GRANTED)}>
                Bypass
            </Button>
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
