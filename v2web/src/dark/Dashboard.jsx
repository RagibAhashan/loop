import axios from 'axios';
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
    const { user, logoutUser, fetchingUser, setUser } = useUser();
    const history = useHistory();
    const [wasBound, setWasBound] = useState(false);
    const [renderDelay, setRenderDelay] = useState(true);

    const [licenseKey, setLicenseKey] = useState('');

    useEffect(() => {
        console.log('Dashboard init');
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

    const handleActivateKey = async () => {
        if (!licenseKey) return;
        console.log('activating', licenseKey);
        try {
            const resp = await axios.post(
                process.env.REACT_APP_SERVER_ENDPOINT + '/license/activate',
                { key: licenseKey },
                { withCredentials: true },
            );

            console.log('got user after activating license');
            setUser(resp['data']);
        } catch (error) {
            console.log('Error activating license key', error);
            // TODO show notification
        }
    };

    const handleResetLicenseKey = async (key) => {
        if (!key) return;
        console.log('resetting key', key);

        try {
            const resp = await axios.post(process.env.REACT_APP_SERVER_ENDPOINT + '/license/reset', { key }, { withCredentials: true });
            setUser(resp['data']);
        } catch (error) {
            console.log('Error resetting key', error);
        }
    };

    return fetchingUser ? null : renderDelay ? null : (
        <div>
            <div>
                <div>
                    <button onClick={handleLogout}>LOG OUT</button>
                </div>

                <div></div>

                <div>
                    <label>
                        Bind a license to this discord account (To get invited to the discord group)
                        <input value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" />
                        <button onClick={handleActivateKey}> Submit </button>
                    </label>
                </div>

                <span> -------------- LICENSES MANAGEMENT -------------------</span>

                {user.licenses ? (
                    <div>
                        <pre>{JSON.stringify(user, null, 2)}</pre>

                        {user.licenses.map((license) => {
                            return (
                                <div key={license.key}>
                                    <div>
                                        <span> License : </span>
                                        <span> {license.key} </span>
                                    </div>
                                    <div>
                                        {/* (You can only use one device at a time) */}
                                        <span>Unbind key from device </span>
                                        <div> Current device </div>
                                        <span> {license.deviceInfo.hostname} </span>
                                        <span> {license.deviceInfo.platform} </span>
                                        <span> {license.deviceInfo.release} </span>
                                    </div>
                                    {/* (by resetting the license, it will remove access from our discord and you can no longer use it
                                        unless you bind it again) */}
                                    <button onClick={() => handleResetLicenseKey(license.key)}>Reset key</button>

                                    <button>Manage subscription for this license</button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div> No licenses... Start by binding one</div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
