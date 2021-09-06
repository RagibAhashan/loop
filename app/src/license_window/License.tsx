import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { ACTIVATE_LICENSE_ROUTE, GET_SYSTEM_ID, VALIDATE_USER_DATA_ROUTE } from '../common/Constants';
import ActivateLicense from './pages/ActivateLicense';
import ValidateUserComponent from './pages/ValidateUser';

const License = withRouter(({ history }) => {
    const [LICENSE_KEY] = useState('');
    const [email] = useState('');
    const [, setCode] = useState(201);
    const [, setLoading] = useState(false);

    useEffect(() => {
        history.push(VALIDATE_USER_DATA_ROUTE);
    }, [history]);

    const useForceUpdate = () => {
        const [value, setValue] = useState(0);
        return () => setValue((value) => value + 1);
    };
    const forceUpdate = useForceUpdate();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getID = async () => {
        const SYSTEM_KEY = await window.ElectronBridge.invoke(GET_SYSTEM_ID);
        try {
            setLoading((prev) => (prev = true));
            const post = await axios.post('http://localhost:4000/user/activatekey/', {
                L_KEY: LICENSE_KEY,
                SYSTEM_KEY: SYSTEM_KEY,
                email: email,
            });
            console.log(post.status);
            setCode((prev) => (prev = 201));
        } catch (error) {
            if ((error as any).toString() === 'Error: Request failed with status code 409') {
                console.log('Error: Request failed with status code 409');
            }

            switch ((error as any).toString()) {
                case 'Error: Request failed with status code 409': {
                    setCode((prev) => (prev = 409));

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
