// import React, { Fragment } from 'react';

// const App = () => {
//     return (
//         <Fragment>
//             <button
//                 onClick={() => {
//                     window.ElectronBridge.send('test-channel', 'test string', 123, []);
//                 }}
//             >
//                 click
//             </button>
//             <div style={{ color: 'white' }}> Test font 123 hi how are you doing I am doing pretty fine thanks </div>
//         </Fragment>
//     );
// };

// export default App;

import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { NOTIFY_ON_START_INIT_TASK, PROFILE_ROUTE, PROXY_ROUTE, SETTINGS_ROUTE, TASKS_ROUTE } from '../common/Constants';
import SideBar from '../components/sidebar';
import { StoreType } from '../constants/Stores';
import ProfilePage from '../pages/Profile/profiles';
import ProxyPage from '../pages/Proxies/ProxyPage';
import SettingsPage from '../pages/settingsPage';
import TaskPage from '../pages/Task/TaskPage';
import { Fingerprint } from '../services/Fingerprint';
import { getStores, StoreState } from '../services/Store/StoreService';
const { Content } = Layout;

const generateFingerPrint = () => {
    if (!localStorage.getItem('deviceId')) {
        const deviceId = Fingerprint.getDeviceId();
        localStorage.setItem('deviceId', deviceId);
    }
};

// On startup send event to main to intialise task manager struct
const initTasksStatus = (stores: StoreState) => {
    Object.entries(stores).forEach(([storeName, store]) => {
        if (Object.keys(store.tasks).length) {
            window.ElectronBridge.send(NOTIFY_ON_START_INIT_TASK(storeName as StoreType), Object.values(store.tasks));
        }
    });
};

const App = () => {
    const stores = useSelector(getStores);

    useEffect(() => {
        initTasksStatus(stores);
        generateFingerPrint();
    }, [stores]);

    return (
        <Layout>
            <SideBar />
            <Layout>
                <Content style={{ height: '100vh', backgroundColor: '#212427' }}>
                    <Route path={PROFILE_ROUTE} exact component={ProfilePage} />
                    <Route path={PROXY_ROUTE} exact component={ProxyPage} />
                    <Route path={SETTINGS_ROUTE} exact component={SettingsPage} />
                    <Route path={TASKS_ROUTE} exact component={TaskPage} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
