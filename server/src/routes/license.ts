import axios from 'axios';
import { Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import * as APIResponses from './constants/responses';
import * as LicenseConstants from './constants/LicenseConstants';
import * as DiscordService from '../services/discordService';
import * as LicenseService from '../services/LicenseService';
import * as EmailService from '../services/email';

export const BuyLicense = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const name = req.body.name;
        const LICENSE_KEY = await LicenseService.GenerateLicense(email);
        await EmailService.sendRegistrationConfirmationEmail(email, name, LICENSE_KEY);
        res.send('ok!');
    } catch (error) {
        res.send('!ok');
    }
};

export const LicenseBind = async (req: Request, res: Response) => {
    const { discord_id, access_token, avatar, discriminator, email, refresh_token, username, LICENSE_KEY } = req.body;

    const DISCORD_USER = {
        discord_id,
        access_token,
        avatar,
        discriminator,
        email,
        refresh_token,
        username,
    };

    try {
        const db = new Firestore();
        const doc = await db.collection('LICENSE').doc(LICENSE_KEY).get();
        if (doc.exists) {
            const licenseObject: any = doc.data();
            if (licenseObject['STAGE'] === LicenseConstants.STAGE.FREE) {
                const result = await DiscordService.AddUserToGuild(discord_id, access_token);
                console.log(result);
                doc.ref.update({
                    DISCORD: DISCORD_USER,
                    DISCORD_KEY: DISCORD_USER['discord_id'],
                    STAGE: LicenseConstants.STAGE.DISCORD_LOCK,
                });
                res.status(APIResponses.OK).send({
                    message: 'Discord Binded with Key!',
                    discord: req.body,
                });
            } else {
                res.status(APIResponses.FORBIDDEN).send({
                    message: 'Stage of the license is ' + licenseObject['STAGE'],
                });
            }
        } else {
            res.status(APIResponses.NOT_FOUND).send({
                message: 'License key not found!',
            });
        }
    } catch (error) {
        res.status(APIResponses.INTERNAL_SERVER_ERROR).send({
            message: (error as any).message,
        });
    }
};
