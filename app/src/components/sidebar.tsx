import { DesktopOutlined, FileOutlined, HomeOutlined, PieChartOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import logo from '../assets/crown.png';
import styles from './sidebar.module.css';

const { Sider } = Layout;

const SideBar = withRouter(({ history }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(collapsed) => {
                setCollapsed(collapsed);
            }}
        >
            <Row>
                <img alt="Logo" src={logo} className={collapsed ? styles.collapsedLogo : styles.uncollapsedLogo}></img>
            </Row>
            <Menu className={styles.menu} theme="dark" defaultSelectedKeys={['0']} mode="inline">
                <Menu.Item
                    key="0"
                    className={styles.menuItem}
                    icon={<HomeOutlined className={styles.icon} />}
                    onClick={() => {
                        history.push('/');
                    }}
                >
                    Home
                </Menu.Item>

                <Menu.Item
                    key="1"
                    className={styles.menuItem}
                    icon={<PieChartOutlined />}
                    onClick={() => {
                        history.push('/app/profiles');
                    }}
                >
                    Profiles
                </Menu.Item>

                <Menu.Item
                    key="2"
                    className={styles.menuItem}
                    icon={<DesktopOutlined />}
                    onClick={() => {
                        history.push('/app/proxies');
                    }}
                >
                    Manage Proxies
                </Menu.Item>

                <Menu.Item
                    key="3"
                    className={styles.menuItem}
                    icon={<FileOutlined />}
                    onClick={() => {
                        history.push('/app/tasks');
                    }}
                >
                    Tasks
                </Menu.Item>
                <Menu.Item
                    key="4"
                    className={styles.menuItem}
                    icon={<SettingOutlined />}
                    onClick={() => {
                        history.push('/app/settings');
                    }}
                >
                    Settings
                </Menu.Item>
            </Menu>
        </Sider>
    );
});

export default SideBar;
