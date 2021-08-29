import React from 'react';
import './landingPage.css'
import { Button, Layout, Menu, Row, Col } from 'antd';
import { useHistory } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

const DISCORD_OAUTH2_URL = 'https://discord.com/oauth2/authorize?client_id=812912838925615144&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fredirect&response_type=code&scope=identify%20email%20guilds.join';

const LandingPage = () => {
    const history = useHistory();

    return (
        <Layout className="layout">
            <Header className="header">
                <Row>
                    <Col span={3}> <div className="logo" /> </Col>
                    <Col span={3}> <div> Dynasty </div> </Col>
                    <Col span={18}> 
                        <div className="nav-buttons">
                        <a href="/dashboard">
                            <input type="button" value="Dashboard"/></a>
                        </div> 
                    </Col>
                </Row>
            </Header>
            <Content>
                <Row>
                    <Col span={12}  className="content1">
                        <div> Secure limited release products with </div> 
                    </Col>
                    <Col span={12} className="content1"> 
                        <img className="app" src={'https://cdn.cybersole.io/media/CyberAIO.png'}/>
                    </Col>
                </Row>
            </Content>
            <Content>
                <div className="content2"> 
                    Content2
                </div>
            </Content>
            <Footer className="footer">Dynasty ©2021</Footer>
        </Layout>
    )
}

export default LandingPage;