import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { PROFILE_ROUTE, PROXY_ROUTE, SETTINGS_ROUTE, TASKS_ROUTE } from './common/Constants';
import SideBar from './components/sidebar';
import { IStore } from './interfaces/OtherInterfaces';
import { TaskData } from './interfaces/TaskInterfaces';
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

// On startup destroy all tasks last status
const initTasksStatus = () => {
    const stores = JSON.parse(localStorage.getItem('stores') as string) as IStore[];
    if (!stores) return;

    stores.forEach((store) => {
        const storeTasks = JSON.parse(localStorage.getItem(store.key) as string) as TaskData[];
        if (storeTasks) {
            storeTasks.forEach((task) => localStorage.removeItem(task.uuid));
        }
    });
};
const App = () => {
    useEffect(() => {
        initTasksStatus();
        generateFingerPrint();
    }, []);

    return (
        <Layout>
            <SideBar />
            <Layout>
                <Content style={{ height: '100vh', backgroundColor: '#212427' }}>
                    <Switch>
                        <Route path={PROFILE_ROUTE} exact component={ProfilePage} />
                        <Route path={PROXY_ROUTE} exact component={ProxyPage} />
                        <Route path={SETTINGS_ROUTE} exact component={SettingsPage} />
                        <Route path={TASKS_ROUTE} exact component={TaskPage} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
