import axios from 'axios';
import { Request, Response } from 'express';
import * as APIResponses from './constants/responses';
import * as DiscordService from '../services/discordService';

const API_ENDPOINT = 'https://discord.com/api/v8';

export const Authorize = async (req: Request, res: Response) => {
    try {
        const { access_token, expires_in, refresh_token, scope, token_type } = await DiscordService.GetAccessToken(req.query.code as string);
        const { id, username, avatar, discriminator, email } = await DiscordService.GetDiscordUserInformation(token_type, access_token); 
        const results = await DiscordService.AddUserToGuild(API_ENDPOINT, id, access_token);
    } catch (error) {
      console.error(error);
      res.status(APIResponses.UNAUTHORIZED).send({
        message: 'Unauthorized'
      });    
    }

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
