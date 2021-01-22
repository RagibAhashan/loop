import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row } from 'antd';
import * as Constants from '../constants';
import styles from './sidebar.module.css';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  SettingOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import logo from '../assets/crown.png'

const { Sider } = Layout;

const SideBar = (props: any) => {
  const { currentPage, setPage } = props;

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => {
        setCollapsed(collapsed);
      }}
    >
      <Row><img alt="Logo" src={logo} className={styles.logo}></img></Row>
      <Menu
        className={styles.menu}
        theme="dark"
        defaultSelectedKeys={['0']}
        mode="inline"
      >
        <Menu.Item
          key="0"
          className={styles.menuItem}
          icon={<HomeOutlined className={styles.icon} />}
          onClick={() => {
            setPage(Constants.MAIN);
          }}
        >
          Home
        </Menu.Item>

        <Menu.Item
          key="1"
          className={styles.menuItem}
          icon={<PieChartOutlined />}
          onClick={() => {
            setPage(Constants.BILLING);
          }}
        >
          Billing Information
        </Menu.Item>

        <Menu.Item
          key="2"
          className={styles.menuItem}
          icon={<DesktopOutlined />}
          onClick={() => {
            setPage(Constants.PROXIES);
          }}
        >
          Manage Proxies
        </Menu.Item>

        <Menu.Item
          key="3"
          className={styles.menuItem}
          icon={<FileOutlined />}
          onClick={() => {
            setPage(Constants.TASKS);
          }}
        >
          Tasks
        </Menu.Item>
        <Menu.Item
          key="4"
          className={styles.menuItem}
          icon={<SettingOutlined />}
          onClick={() => {
            setPage(Constants.SETTINGS);
          }}
        >
          Settings
        </Menu.Item>

      </Menu>
    </Sider>
  );
};

export default SideBar;