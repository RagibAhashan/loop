import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import SideBar from './components/sidebar';
import Home from './pages/Home';
import ProfilePage from './pages/Profile/profiles';
import ProxyPage from './pages/Proxies/ProxyPage';
import SettingsPage from './pages/settingsPage';
import TaskPage from './pages/Task/TaskPage';
import { Fingerprint } from './services/Fingerprint';
const { Content } = Layout;

const generateFingerPrint = () => {
    if (!localStorage.getItem('deviceId')) {
        const deviceId = Fingerprint.getDeviceId();
        localStorage.setItem('deviceId', deviceId);
    }
};
const App = () => {
    useEffect(() => {
        generateFingerPrint();
    }, []);

    return (
        <Layout>
            <SideBar />
            <Layout>
                <Content style={{ height: '100vh', backgroundColor: '#212427' }}>
                    <Switch>
                        <Route path="/app/home" exact component={Home} />
                        <Route path="/app/profiles" exact component={ProfilePage} />
                        <Route path="/app/proxies" exact component={ProxyPage} />
                        <Route path="/app/settings" exact component={SettingsPage} />
                        <Route path="/app/tasks" exact component={TaskPage} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
