import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';

import SideBar from './components/sidebar'
import CustomerForm from './components/customerForm'
import * as Constants from './constants.tsx'


const { Header, Content, Footer, Sider } = Layout;

const App = () => {

  

  const [page, setPage] = useState(Constants.MAIN)



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
              {page === Constants.MAIN ?    <div> MAINS </div> : ''}
              {page === Constants.BILLING ? <div> BILLING </div> : ''}
              {page === Constants.PROXIES ? <div> PROXIES </div> : ''}
              {page === Constants.TASKS ?   <div> TASKS </div> : ''}
            
            </div>
          </Content>
        </Layout>
      </Layout>

  );
}

export default App;