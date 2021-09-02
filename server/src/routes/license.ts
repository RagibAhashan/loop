import axios from 'axios';
import { Request, Response } from 'express';
import * as APIResponses from './constants/responses';
import * as DiscordService from '../services/discordService';
import * as LicenseService from '../services/LicenseService';

export const BuyLicense = async (req: Request, res: Response) => {
    try {
        await LicenseService.GenerateLicense(req.body.email);
        res.send('ok!')
    } catch (error) {
        res.send('!ok')
    }
}


