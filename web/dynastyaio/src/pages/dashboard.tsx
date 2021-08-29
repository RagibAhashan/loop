import React, { useState, useEffect } from 'react';
import { Input, Button, Spin } from 'antd';
import './dashboard.css'
import DiscordAuthenticate from './dashboard/discordAuthenticate';
import axios from 'axios';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

const DISCORD_OAUTH2_URL = 'https://discord.com/api/oauth2/authorize?client_id=812912838925615144&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard&response_type=code&scope=identify%20email%20guilds.join';

const { Search } = Input;


/**
 * This shit is for testing the server only. Nothing really works here, all gotta go later.
 * @param props 
 * @returns 
 */

const Dashboard = (props: any) => {
    const history = useHistory();
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [discordUsername, setDiscordUsername] = useState(null);

    const DiscordAuthenticate = async () => {
        const res = await axios.get('http://localhost:4000/redirect')
    };

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
            axios.get(`http://localhost:4000/redirect?code=${code}`)
            .then((res) => {
                console.log(res);
                setLoading(false);
                setDiscordUsername(res.data.username);
            })
            .catch(err => setLoading(false))
        } else {
            setLoading(false);
        }
    }, [])


    return (<div className='middleDiv'>
        <div>
            <h1> {!discordUsername ? '' : `Welcome ${discordUsername}`} </h1>


            {loading ? <Spin /> : 
            

            // {
                !discordUsername ? 
                <Button type='primary' danger
                onClick={() => {window.location.href = DISCORD_OAUTH2_URL}}>
                    Sign in with Discord to continue
                </Button>
                :
                <div>
                    {/* <Input placeholder='Enter your fucking license key' /> */}
                    <Search
                        style={{ width: '300%'}}
                        placeholder="License key"
                        enterButton="Search"
                        size="small"
                        onSearch={(value) => console.log(value)}
                        />
                </div>
            // }
                    }
            

            

        </div>

        {/* <BrowserRouter>
            <Switch>
                <Route path="/" exact component={DiscordAuthenticate} />
                <Route path="/dashboard/" component={Dashboard} />
            </Switch>
        </BrowserRouter> */}

    </div>);
}


export default Dashboard;