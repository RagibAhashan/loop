import AccountPage from '@pages/account/account-page';
import SettingsPage from '@pages/settings/settings-page';
import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { Route } from 'react-router-dom';
import { ACCOUNTS_ROUTE, PROFILE_ROUTE, PROXY_ROUTE, SETTINGS_ROUTE, TASKS_ROUTE } from '../common/Constants';
import SideBar from '../components/base/sidebar';
import ProfilePage from '../pages/profile/profile-page';
import ProxyPage from '../pages/proxy/proxy-page';
import TaskPage from '../pages/task/task-page';
import { Fingerprint } from '../services/fingerprint';
const { Content } = Layout;

const generateFingerPrint = () => {
    if (!localStorage.getItem('deviceId')) {
        const deviceId = Fingerprint.getDeviceId();
        localStorage.setItem('deviceId', deviceId);
    }
};

const App = () => {
    // const { colorMode, toggleColorMode } = useColorMode();

    // Important : This useEffect needs to only be executed once at startup
    useEffect(() => {
        console.log('app refresh wtf');
        // initTasksStatus(stores);
        generateFingerPrint();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
            <SideBar />
            <Layout>
                <Content style={{ height: '100vh', backgroundColor: '#212427' }}>
                    <Route path={PROFILE_ROUTE} exact component={ProfilePage} />
                    <Route path={PROXY_ROUTE} exact component={ProxyPage} />
                    <Route path={SETTINGS_ROUTE} exact component={SettingsPage} />
                    <Route path={TASKS_ROUTE} exact component={TaskPage} />
                    <Route path={ACCOUNTS_ROUTE} exact component={AccountPage} />
                </Content>
            </Layout>
        </Layout>
    );
};

// https://github.com/electron-userland/electron-forge/issues/2560
// export default App;
export default hot(module)(App);
