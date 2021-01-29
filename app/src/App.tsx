import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import SideBar from './components/sidebar';
import * as Constants from './constants';
import BillingPage from './pages/billing';
import ProxyPage from './pages/proxy';
import TaskPage from './pages/Task/taskPage';
import TestPage from './pages/testPage';
import { BrowserRouter, MemoryRouter, Route, Switch } from 'react-router-dom';
import { Fingerprint } from './services/Fingerprint';
import Home from './pages/Home';
import CaptchaFrame from './components/CaptchaFrame';
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
        <Layout style={{ minHeight: '100vh' }}>
            <SideBar />
            <Layout>
                <Content>
                    <div style={{ backgroundColor: '#212427', height: '1000vh' }}>
                        <Switch>
                            <Route path="/main/home" exact component={Home} />
                            <Route path="/main/billing" exact component={BillingPage} />
                            <Route path="/main/proxies" exact component={ProxyPage} />
                            <Route path="/main/tasks" exact component={TaskPage} />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
