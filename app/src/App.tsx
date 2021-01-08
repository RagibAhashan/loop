import React, { useState } from 'react';
import { Layout } from 'antd';

import SideBar from './components/sidebar';
import BillingPage from './pages/billing';
import ProxyPage from './pages/proxy';
import CreateTaskPage from './pages/createTask';
import * as Constants from './constants';


const { Header, Content } = Layout;

const App = () => {



  const [page, setPage] = useState(Constants.BILLING)


  return (

    <Layout style={{ minHeight: '100vh' }}>

      <SideBar
          currentPage={page}
          setPage={setPage}
      />

    <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

              {page === Constants.MAIN    ? <div> MAINS </div> : ''}
              {page === Constants.BILLING ? <BillingPage setPage={setPage} /> : ''}
              {page === Constants.PROXIES ? <ProxyPage /> : ''}
              {page === Constants.TASKS   ? <div> TASKS </div> : ''}
              {page === Constants.NEW_TASK   ? <CreateTaskPage /> : ''}

            </div>
          </Content>
        </Layout>
      </Layout>

  );
}

export default App;
