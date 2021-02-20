import { Button, Form, Input, Spin } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { PROFILE_ROUTE, ACTIVATE_LICENSE_ROUTE, VALIDATE_USER_DATA_ROUTE } from '../../common/Constants';
import ValidateUserComponent from './ValidateUser';
import ActivateLicense from './ActivateLicense';

const { ipcRenderer } = window.require('electron');

const License = withRouter(({ history }) => {
    const [LICENSE_KEY, setLicenseKey] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(201);
    const [loading, setLoading] = useState(false);
    const [validateSystemLoading, SetValidationSystem] = useState(true);

    useEffect(() => {
        history.push(VALIDATE_USER_DATA_ROUTE);
    }, []);

    function useForceUpdate() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [value, setValue] = useState(0); // integer state
        return () => setValue((value) => value + 1); // update the state to force render
    }
    const forceUpdate = useForceUpdate();

    const getID = async () => {
        const SYSTEM_KEY = await ipcRenderer.invoke('GET-SYSTEM-ID');
        try {
            setLoading((prev) => (prev = true));
            const post = await axios.post('http://c87c5e069515.ngrok.io/user/activatekey/', {
                L_KEY: LICENSE_KEY,
                SYSTEM_KEY: SYSTEM_KEY,
                email: email,
            });
            console.log(post.status);
            setCode((prev) => (prev = 201));
            history.push(PROFILE_ROUTE);
        } catch (error) {
            if (error.toString() === 'Error: Request failed with status code 409') {
            }

            switch (error.toString()) {
                case 'Error: Request failed with status code 409': {
                    setCode((prev) => (prev = 409));

                    break;
                }
                case 'Error: Request failed with status code 404': {
                    setCode((prev) => (prev = 404));
                    break;
                }
                case 'Error: Request failed with status code 404': {
                    setCode((prev) => (prev = 404));
                    break;
                }
                default:
                    setCode((prev) => (prev = 500));
                    break;
            }
        }

        setLoading((prev) => (prev = false));
        forceUpdate();
        return SYSTEM_KEY;
    };

    return (
        <div>
            <Route path={VALIDATE_USER_DATA_ROUTE} exact component={ValidateUserComponent} />
            <Route path={ACTIVATE_LICENSE_ROUTE} exact component={ActivateLicense} />
        </div>
    );
});

export default License;
