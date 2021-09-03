import axios from 'axios';
import { Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import * as APIResponses from './constants/responses';
import * as LicenseConstants from './constants/LicenseConstants';
import * as DiscordService from '../services/discordService';
import * as LicenseService from '../services/LicenseService';
import * as EmailService from '../services/email';
import * as Errors from '../services/errors';
import { firestore } from 'firebase-admin';

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

/**
 * This request checks the validity of the License Key, then adds the discord user to the database
 * @param req body: {discord_id, access_token, avatar, discriminator, email, refresh_token, username, LICENSE_KEY}
 * @param res
 */
export const LicenseBindDiscord = async (req: Request, res: Response) => {
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

export const LicenseBindSystem = async (req: Request, res: Response) => {
    const { LICENSE_KEY, SYSTEM_KEY } = req.body;
    try {
        const db = new Firestore();
        const docRefUser = await db.collection('USERS').doc(SYSTEM_KEY).get();
        if (docRefUser.exists) {
            throw new Errors.UserAlreadyExistError('UserAlreadyExistError');
        }
        const docRef = await db.collection('LICENSE').doc(LICENSE_KEY).get();
        if (docRef.exists) {
            const data: any = docRef.data();
            if (data['STAGE'] === LicenseConstants.STAGE.FREE) {
                res.status(APIResponses.NOT_ACCEPTABLE).send({
                    message: 'Please bind with discord',
                });
            } else if (data['STAGE'] === LicenseConstants.STAGE.DISCORD_LOCK) {
                await db.collection('USERS').doc(SYSTEM_KEY).set({
                    DISCORD_KEY: data.DISCORD_KEY,
                    LICENSE_KEY: data.LICENSE_KEY,
                    SYSTEM_KEY: SYSTEM_KEY,
                });
                docRef.ref.update({ SYSTEM_KEY: SYSTEM_KEY, STAGE: 'SYSTEM_LOCK' });

                res.status(APIResponses.OK).send({
                    message: 'License key found!',
                });
            } else if (data['STAGE'] === LicenseConstants.STAGE.SYSTEM_LOCK) {
                res.status(APIResponses.NOT_ACCEPTABLE).send({
                    message: 'Invalid License Key',
                });
            } else {
                res.status(APIResponses.INTERNAL_SERVER_ERROR).send({
                    message: 'internal error',
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

export const AuthSystemElectron = async (req: Request, res: Response) => {
    const SYSTEM_KEY = req.params.SYSTEM_KEY;

    try {
        const db = new Firestore();
        const docRef = await db.collection('USERS').doc(SYSTEM_KEY).get();
        if (docRef.exists) {
            console.log('User found in USERS!');
            const user_keys: any = docRef.data();
            const docRefLicense = await db.collection('LICENSE').doc(user_keys['LICENSE_KEY']).get();
            if (docRefLicense.exists) {
                console.log('docRefLicense.exists');
                const LicenseField: any = docRefLicense.data();
                if (
                    LicenseField.DISCORD_KEY === user_keys.DISCORD_KEY &&
                    LicenseField.LICENSE_KEY === user_keys.LICENSE_KEY &&
                    LicenseField.SYSTEM_KEY === user_keys.SYSTEM_KEY
                ) {
                    console.log('docRefLicense.exists!!!!');
                    res.status(APIResponses.OK).send({
                        message: 'works!',
                    });
                }
            } else {
                console.log('!docRefLicense.exists');
                throw new Errors.UserNotFoundError('UserNotFoundError');
            }
        } else {
            console.log('!!!!docRefLicense.exists');
            throw new Errors.UserNotFoundError('UserNotFoundError');
        }
    } catch (error) {
        if (error instanceof Errors.UserNotFoundError) {
            res.status(APIResponses.NOT_FOUND).send({
                message: (error as any).message,
            });
        } else {
            res.status(APIResponses.INTERNAL_SERVER_ERROR).send({
                message: 'INTERNAL_SERVER_ERROR',
            });
        }
    }
};
