import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import SideBar from '../components/sidebar';
import Home from '../Application/pages/Home';
import ProfilePage from '../Application/pages/Profile/profiles';
import ProxyPage from '../Application/pages/Proxies/ProxyPage';
import SettingsPage from '../Application/pages/settingsPage';
import TaskPage from '../Application/pages/Task/TaskPage';
import { Fingerprint } from '../services/Fingerprint';
const { Content } = Layout;

const generateFingerPrint = () => {
    if (!localStorage.getItem('deviceId')) {
        const deviceId = Fingerprint.getDeviceId();
        localStorage.setItem('deviceId', deviceId);
    }
};

const Application = () => {
    useEffect(() => {
        generateFingerPrint();
    }, []);
    return (
        <Layout>
            <SideBar />
            <Layout>
                <Content style={{ height: '100vh', backgroundColor: '#212427' }}>
                    <Switch>
                        <Route path="/home" exact component={Home} />
                        <Route path="/profiles" exact component={ProfilePage} />
                        <Route path="/proxies" exact component={ProxyPage} />
                        <Route path="/settings" exact component={SettingsPage} />
                        <Route path="/tasks" exact component={TaskPage} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Application;
