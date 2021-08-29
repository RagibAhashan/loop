import axios from 'axios';
const API_ENDPOINT = 'https://discord.com/api/v8';
const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.CLIENT_REDIRECT as string;
const GUILD_ID: string = process.env.GUILD_ID as string;
const BOT_TOKEN: string = process.env.BOT_TOKEN as string;

/**
 * Makes a post request with the query code, it needs discord's client_id
 * and client_secret key, and the redirect uri. It Authenticates the user.
 * @param query_code this is the query code from the HTTP request.
 * @returns { access_token, expires_in, refresh_token, scope, token_type }
 */
export const GetAccessToken = async (query_code: string) => {
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

/**
 * It takes the access token and returns user data.
 * @param token_type 
 * @param access_token 
 * @returns 
 */
export const GetDiscordUserInformation = async (token_type: string, access_token: string) => {
    const result: any = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          'authorization': `${token_type} ${access_token}`
        }
    });

    console.log('result', result['data']);
    return result['data'];
}

/**
 * Adds user to the guild (server).
 * @param API_ENDPOINT 
 * @param userID 
 * @param access_token 
 * @returns 
 */
export const AddUserToGuild = async (API_ENDPOINT: string, userID: string, access_token: string) => {
    const URL: string = `${API_ENDPOINT}/guilds/${GUILD_ID}/members/${userID}`;
    const headers = {
        'Authorization': `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json'
    }
    const res = await axios.put(URL, {'access_token': access_token}, {headers: headers});
    return res;
}


