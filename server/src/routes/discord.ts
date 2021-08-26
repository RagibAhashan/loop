import axios from 'axios';
import { Request, Response } from 'express';
import * as APIResponses from './constants/responses';

const API_ENDPOINT = 'https://discord.com/api/v8';
const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.CLIENT_REDIRECT as string;
const GUILD_ID: string = process.env.GUILD_ID as string;

export const getAccessToken = async (query_code: string) => {
    const code = query_code;
    
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    const response: any = await axios.post(API_ENDPOINT + '/oauth2/token', params, { headers: headers });
    return response['data'];
}

export const getDiscordUserInformation = async (token_type: string, access_token: string) => {
    const result: any = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          'authorization': `${token_type} ${access_token}`
        }
    });

    console.log('result', result['data']);
    return result['data'];
}

export const Authorize = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    try {
        const { access_token, expires_in, refresh_token, scope, token_type } = await getAccessToken(code);
        const {
            id,
            username,
            avatar,
            discriminator,
            public_flags,
            flags,
            banner,
            banner_color,
            accent_color,
            locale,
            mfa_enabled,
            email,
            verified
        } = await getDiscordUserInformation(token_type, access_token);

        

        const test: any = await addUserToGuild(API_ENDPOINT, GUILD_ID, id, access_token);
        console.log(test);

    } catch (error) {
      console.error(error);
      res.status(APIResponses.UNAUTHORIZED).send({
        message: 'Unauthorized'
      });    
    }
    let n = 0;
    n = Math.floor(Math.random()*10);

    switch (Math.floor(Math.random()*10)) {
        case 0: res.redirect('https://youtu.be/AfIOBLr1NDU?t=2'); break;
        case 1: res.redirect('https://youtu.be/LDU_Txk06tM?t=74'); break;
        case 2: res.redirect('https://youtu.be/vxKBHX9Datw?t=3'); break;
        case 3: res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley'); break;
        case 4: res.redirect('https://youtu.be/tTelnNmRUH0?t=43'); break;
        case 5: res.redirect('https://youtu.be/yBLdQ1a4-JI?t=12'); break;
        case 6: res.redirect('https://youtu.be/LAVUFKYdJNY?t=46'); break;
        case 7: res.redirect('https://youtu.be/zQNnyxuru4M?t=10'); break;
        case 8: res.redirect(`https://youtu.be/zjm3t4gwcqo?t=9`); break;
        case 9: res.redirect('https://www.youtube.com/watch?v=2USMvShha4w&ab_channel=GeorgiaTz'); break;
        case 10: res.redirect('https://www.youtube.com/watch?v=amzuB5iWlJk&ab_channel=SpicyLice'); break;
        default: res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley'); break;
    }
}

export const addUserToGuild = async (API_ENDPOINT: string,
                                    guildID: string,
                                    userID: string,
                                    access_token: string) => {
    const URL: string = `${API_ENDPOINT}/guilds/${guildID}/members/${userID}`;
    const BOT_TOKEN: string = 'ODEyOTEyODM4OTI1NjE1MTQ0.YDHqEw.wNOPELEsFl6Hnqc3Um29st7o6Vo';
    const data = {
        'access_token': access_token
    }

    const headers = {
        'Authorization': `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json'
    }
    const res = await axios.put(URL, {'access_token': access_token}, {headers: headers});

    console.log(res);
    return res;
}


