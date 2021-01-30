import { Layout } from 'antd';
import React, { useEffect } from 'react';
import SideBar from './components/sidebar';
import ProfilePage from './pages/billing';
import ProxyPage from './pages/proxy';
import TaskPage from './pages/Task/taskPage';
import { Route, Switch } from 'react-router-dom';
import { Fingerprint } from './services/Fingerprint';
import Home from './pages/Home';
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
                            <Route path="/home"     exact component={Home} />
                            <Route path="/billing"  exact component={ProfilePage} />
                            <Route path="/proxies"  exact component={ProxyPage} />
                            <Route path="/tasks"    exact component={TaskPage} />
                        </Switch>
                    </div>
                </Content>

                
            </Layout>
        </Layout>
    );
};

export default App;
