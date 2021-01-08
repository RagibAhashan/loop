import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd';
import * as Constants from '../constants'
import './sidebar.css'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined
} from '@ant-design/icons';

const { Sider } = Layout;


const SideBar = (props: any) => {
    const {currentPage, setPage} = props;

    const [collapsed, setCollapsed] = useState(false) 

    useEffect(() => {
        console.log(props)
    }, [])
    
    

      return (
          <Sider collapsible collapsed={collapsed} onCollapse={(collapsed) => {
            setCollapsed(collapsed)
          }}>
            <div className="logo" />
            <Menu
            style={{marginTop:'30%'}}
            theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => {
                setPage(Constants.BILLING)
              }}>
                Billing Information
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />} onClick={() => {
                setPage(Constants.PROXIES)
              }}>
                Manage Proxies
              </Menu.Item>
              <Menu.Item key="9" icon={<FileOutlined />} onClick={() => {
                setPage(Constants.TASKS)
              }}>
                Tasks
              </Menu.Item>
            </Menu>
          </Sider>

      );

  }

export default SideBar;