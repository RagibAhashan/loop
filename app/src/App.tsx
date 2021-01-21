import React, { useState } from 'react';
import { Layout } from 'antd';

import SideBar from './components/sidebar';
import BillingPage from './pages/billing';
import ProxyPage from './pages/proxy';
import TaskPage from './pages/Task/task'
import * as Constants from './constants';


const { Header, Content } = Layout;

const App = () => {



  const [page, setPage] = useState(Constants.MAIN)


  return (

    <Layout style={{ minHeight: '100vh' }}>

      <SideBar
          currentPage={page}
          setPage={setPage}
      />

    <Layout >
      {/* className="site-layout"> */}
          <Content > 
           {/* style={{ margin: '0 16px' }}> */}
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

              {page === Constants.MAIN    ? <div> MAINS </div> : ''}
              {page === Constants.BILLING ? <BillingPage setPage={setPage} /> : ''}
              {page === Constants.PROXIES ? <ProxyPage setPage={setPage} /> : ''}
              {page === Constants.TASKS   ? <TaskPage /> : ''}

            </div>
          </Content>
        </Layout>
      </Layout>

  );
}

export default App;
