import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import SideBar from './components/sidebar';
import * as Constants from './constants';
import BillingPage from './pages/billing';
import ProxyPage from './pages/proxy';
import TaskPage from './pages/Task/taskPage';
import TestPage from './pages/testPage';
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
    const [page, setPage] = useState(Constants.MAIN);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideBar currentPage={page} setPage={setPage} />

            <Layout>
                <Content>
                    <div style={{ backgroundColor: '#212427', height: '1000vh' }}>
                        {page === Constants.MAIN ? <div> Welcome </div> : ''}
                        {page === Constants.BILLING ? <BillingPage setPage={setPage} /> : ''}
                        {page === Constants.PROXIES ? <ProxyPage setPage={setPage} /> : ''}
                        {page === Constants.TEST ? <TestPage /> : ''}

                        {page === Constants.TASKS ? '' : <div style={{ height: '1000vh' }} />}
                        <TaskPage />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
