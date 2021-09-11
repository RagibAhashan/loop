import Footer from "../component/footer/FooterTwo";
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT || 'http://localhost:4000';
const DISCORD_OAUTH2_URL = 'https://discord.com/api/oauth2/authorize?client_id=812912838925615144&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard&response_type=code&scope=identify%20email%20guilds.join';


/**
 * This shit is for testing the server only. Nothing really works here, all gotta go later.
 * @param props 
 * @returns 
 */

const Dashboard = (props) => {

    const history = useHistory();
    const [wasBound, setWasBound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [discordUsername, setDiscordUsername] = useState(null);
    const [discordUserInformation, setDiscordUserInformation] = useState({});

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
            axios.get(`${SERVER_ENDPOINT}/oauth?code=${code}`)
            .then((res) => {
                setDiscordUserInformation(res.data);
                console.log(res);
                setLoading(false);
                setDiscordUsername(res.data.username);
            })
            .catch(err => setLoading(false))
        } else {
            setLoading(false);
        }
    }, []);

    const BindLicense = async (key) => {
        console.log('Firing license now: ', key);
        
        let DiscordUserInformation = discordUserInformation;
        DiscordUserInformation['LICENSE_KEY'] = key;
        console.log('DiscordUserInformation', DiscordUserInformation)

        try {
            const res = await axios.post(`${SERVER_ENDPOINT}/discordbind/`, {
                "discord_id": DiscordUserInformation.discord_id,
                "access_token": DiscordUserInformation.access_token,
                "avatar": DiscordUserInformation.avatar,
                "discriminator": DiscordUserInformation.discriminator,
                "email": DiscordUserInformation.email,
                "refresh_token": DiscordUserInformation.refresh_token,
                "username": DiscordUserInformation.username,
                "LICENSE_KEY": DiscordUserInformation.LICENSE_KEY
            });
            window.alert('Discord lock works');

        } catch (error) {
            console.log(error);
            window.alert('License not found')
        }
        
    }

    return(
        <>
    <div>
        { !discordUsername ? 
        <><div className="rn-finding-us-area attacment-fixed rn-finding-us ptb--140 bg_color--2" data-black-overlay="5">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 offset-lg-2">
                                    <div className="inner">
                                        <div className="content-wrapper">
                                            <div className="content">
                                                <h4 className="theme-gradient">{!discordUsername ? 'Join the botting Dynasty' : `Welcome ${discordUsername}`}</h4>
                                                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that.</p>
                                                <a className="btn-default" href={DISCORD_OAUTH2_URL}>Sign In with Discord</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div><Footer /></> :
        
        <><div className="rn-finding-us-area attacment-fixed rn-finding-us ptb--120 bg_color--2" data-black-overlay="5">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 offset-lg-2">
                                    <div className="inner">
                                        <div className="content-wrapper">
                                            <div className="content">
                                                <h4 className="theme-gradient">Register</h4>
                                                <p>When looking at its layout. The point of using Lorem Ipsum is that.</p>
                                                <div className="form-wrapper">
                                                    <form ref="form" onSubmit={this.BindLicense}>
                                                        <label htmlFor="item01">
                                                            <input
                                                                style={{ backgroundColor: 'white', width: '500px' }}
                                                                type="text"
                                                                name="name"
                                                                id="item01"
                                                                value={this.state.rnName}
                                                                onChange={(e) => { this.setState({ rnName: e.target.value }); } }
                                                                placeholder="e.x. EDEF-123S-21ES-CD21" />
                                                        </label>
                                                        <div style={{ marginTop: '30px' }}>
                                                            <button className="btn-default" type="submit" value="submit" name="submit" id="mc-embedded-subscribe">Submit Now</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div><Footer /></>  }
            </div>
        </>
    )
}

export default Dashboard