import React from 'react';
import './landingPage.css'
import { Button, Layout, Menu, Row, Col, Input } from 'antd';
import { useHistory } from "react-router-dom";
import axios from 'axios';
const { Header, Content, Footer, Sider } = Layout;

const DISCORD_OAUTH2_URL = 'https://discord.com/oauth2/authorize?client_id=812912838925615144&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fredirect&response_type=code&scope=identify%20email%20guilds.join';
const { Search } = Input;

const LandingPage = () => {
    const history = useHistory();

    const BuyBot = async (email: string) => {
        await axios.post('http://localhost:4000/buyLicense/', {
            "email": email,
            "name": "Wail the Boss"
        })
    }

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
                        <div>
                        <Search
                            style={{ width: '100%', marginLeft: '10%'}}
                            placeholder="email"
                            enterButton="Buy Bot"
                            size="large"
                            onSearch={(value) => { BuyBot(value); window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")}}
                        />
                        </div>
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