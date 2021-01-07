import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import SideBar from './components/sidebar'
import CustomerForm from './components/customerForm'
import * as Constants from './constants.tsx'


const MAIN    = 'MAIN'
const BILLING = 'BILLING'
const PROXIES = 'PROXIES'
const TASKS   = 'TASKS'


const { Header, Content, Footer, Sider } = Layout;

const App = () => {

  

  const [page, setPage] = useState(MAIN)



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
              {page}
            </div>
          </Content>
        </Layout>
      </Layout>

  );
}

export default App;