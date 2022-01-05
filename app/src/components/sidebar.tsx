import { DesktopOutlined, FileOutlined, PieChartOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, Row } from 'antd';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import logo from '../assets/crown.png';
import { PROFILE_ROUTE, PROXY_ROUTE, SETTINGS_ROUTE, TASKS_ROUTE } from '../common/Constants';

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
                <img alt="Logo" src={logo} className={collapsed ? 'collapsedLogo' : 'uncollapsedLogo'}></img>
            </Row>
            <Menu className="menu" theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item
                    key="1"
                    className="menuItem"
                    icon={<PieChartOutlined />}
                    onClick={() => {
                        history.push(PROFILE_ROUTE);
                    }}
                >
                    Profiles
                </Menu.Item>

                <Menu.Item
                    key="2"
                    className={'menuItem'}
                    icon={<DesktopOutlined />}
                    onClick={() => {
                        history.push(PROXY_ROUTE);
                    }}
                >
                    Proxies
                </Menu.Item>

                <Menu.Item
                    key="3"
                    className={'menuItem'}
                    icon={<FileOutlined />}
                    onClick={() => {
                        history.push(TASKS_ROUTE);
                    }}
                >
                    Tasks
                </Menu.Item>
                <Menu.Item
                    key="4"
                    className={'menuItem'}
                    icon={<SettingOutlined />}
                    onClick={() => {
                        history.push(SETTINGS_ROUTE);
                    }}
                >
                    Settings
                </Menu.Item>
            </Menu>
        </Sider>
    );
});

export default SideBar;
