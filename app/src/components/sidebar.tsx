import { DesktopOutlined, FileOutlined, HomeOutlined, PieChartOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import logo from '../assets/crown.png';
import * as Constants from '../constants';
import styles from './sidebar.module.css';

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
            <Row>
                <img alt="Logo" src={logo} className={collapsed ? styles.collapsedLogo : styles.uncollapsedLogo}></img>
            </Row>
            <Menu className={styles.menu} theme="dark" defaultSelectedKeys={['0']} mode="inline">
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

                <Menu.Item
                    key="5"
                    className={styles.menuItem}
                    icon={<SettingOutlined />}
                    onClick={() => {
                        setPage(Constants.TEST);
                    }}
                >
                    Test Page
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default SideBar;
