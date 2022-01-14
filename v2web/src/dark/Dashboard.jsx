import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../component/common/UserContext';
import Footer from '../component/footer/FooterTwo';

// https://create-react-app.dev/docs/adding-custom-environment-variables/
const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

/**
 * This shit is for testing the server only. Nothing really works here, all gotta go later.
 * @param props
 * @returns
 */

const Dashboard = (props) => {
    const { user, logoutUser, fetchingUser } = useUser();
    const history = useHistory();
    const [wasBound, setWasBound] = useState(false);
    const [renderDelay, setRenderDelay] = useState(true);

    useEffect(() => {
        // Wait for user fetching, this is done in case someone is trying to reach this route
        // manually from the url or after the login redirect from the server
        if (!fetchingUser && !user) {
            console.log('USER TRIED ENTERING PROTECTED GUARD');
            history.push('/');
        }

        // Render the dashboard at the next tick, small bug that makes the dashboard visible for a fraction of a second
        // when the user is not logged in.
        setTimeout(() => {
            setRenderDelay(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        history.push('/');
    };

    return fetchingUser ? null : renderDelay ? null : (
        <div>
            <div className="rn-finding-us-area attacment-fixed rn-finding-us ptb--120 bg_color--2" data-black-overlay="5">
                <div>
                    <button onClick={handleLogout}>LOG OUT</button>
                </div>
                <span>Render dashboard here,</span>

                <span>bind key to discord ( to get invited to discord group )</span>
                <span>unbind key from device (if user wants to computer)</span>
                <span>reset key entirely (unbind from and discord and machine, to resell)</span>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
