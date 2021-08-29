import axios from 'axios';
import { Request, Response } from 'express';
import * as APIResponses from './constants/responses';
import * as DiscordService from '../services/discordService';


const API_ENDPOINT = 'https://discord.com/api/v8';

export const Authorize = async (req: Request, res: Response) => {
    try {
        const { access_token, expires_in, refresh_token, scope, token_type } = await DiscordService.GetAccessToken(req.query.code as string);
        const { id, username, avatar, discriminator, email } = await DiscordService.GetDiscordUserInformation(token_type, access_token); 
        await DiscordService.AddUserToGuild(API_ENDPOINT, id, access_token);
        res.status(APIResponses.OK).send({
          'discord_id': id,
          'username': username,
          'avatar': avatar,
          'discriminator': discriminator,
          'email': email,
          'access_token': access_token,
          'refresh_token': refresh_token
        });
    } catch (error) {
      console.error(error);
      res.status(APIResponses.UNAUTHORIZED).send({
        message: 'Unauthorized'
      });    
    }
}
