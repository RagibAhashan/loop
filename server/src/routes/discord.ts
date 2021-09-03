import axios from 'axios';
import { Request, Response } from 'express';
import * as APIResponses from './constants/responses';
import * as LicenseConstants from './constants/LicenseConstants';
import * as DiscordService from '../services/discordService';
import { Firestore } from '@google-cloud/firestore';

export const Authorize = async (req: Request, res: Response) => {
    try {
        const { access_token, expires_in, refresh_token, scope, token_type } = await DiscordService.GetAccessToken(req.query.code as string);
        const { id, username, avatar, discriminator, email } = await DiscordService.GetDiscordUserInformation(token_type, access_token);
        await DiscordService.AddUserToGuild(id, access_token);
        res.status(APIResponses.OK).send({
            discord_id: id,
            username: username,
            avatar: avatar,
            discriminator: discriminator,
            email: email,
            access_token: access_token,
            refresh_token: refresh_token,
        });
    } catch (error) {
        console.error(error);
        res.status(APIResponses.UNAUTHORIZED).send({
            message: 'Unauthorized',
        });
    }
};

/**
 * Takes the query code and authenticates the user.
 * Returns Access Token along with more user information.
 * @param req
 * @param res { access_token, refresh_token, id, username, avatar, discriminator, email }
 */
export const GetDiscordUserInformation = async (req: Request, res: Response) => {
    try {
        const { access_token, expires_in, refresh_token, scope, token_type } = await DiscordService.GetAccessToken(req.query.code as string);
        const { id, username, avatar, discriminator, email } = await DiscordService.GetDiscordUserInformation(token_type, access_token);
        res.status(APIResponses.OK).send({
            discord_id: id,
            username: username,
            avatar: avatar,
            discriminator: discriminator,
            email: email,
            access_token: access_token,
            refresh_token: refresh_token,
        });
    } catch (error) {
        console.error(error);
        res.status(APIResponses.UNAUTHORIZED).send({
            message: 'Unauthorized',
        });
    }
};
