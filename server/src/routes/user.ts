import { Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import { validationResult } from 'express-validator';
import * as EmailService from '../services/email';
import * as Errors from '../services/errors';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

const bcrypt = require('bcrypt');
const saltRounds = 10;

export const UserPaymentLicenseKey = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors);
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        const { first_name, last_name } = req.body;

        const email = req.body.email.toLowerCase();
        if (!validator.isEmail(email)) {
            throw new Error('Not an email!');
        }
        res.send('paid')
    } catch (error) {
        
    }

}


/**
 * Receives user data and holds the data in a collection temporary until the license key is
 * activated for the very first time.
 * @param req body: user data
 * @param res body: license key
 */
export const RegisterUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors);
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        const { first_name, last_name } = req.body;

        const email = req.body.email.toLowerCase();
        if (!validator.isEmail(email)) {
            throw new Error('Not an email!');
        }

        const db = new Firestore();
        const USER_ID = uuidv4().toUpperCase();
        const LICENSE_KEY = uuidv4().toUpperCase();
        const HASHED_LKEY = await bcrypt.hash(LICENSE_KEY, saltRounds);



        const USER_DATA = {
            SYSTEM_KEY: '',
            discord: {},
            email: email.toString().toLowerCase(),
            first_name: first_name,
            last_name: last_name,
            user_id: USER_ID,
            LICENSE_KEY: HASHED_LKEY,
            joined: { Date: new Date().toString(), unix: Date.now() },
        };

        const SubscribersRef = db.collection('Users').doc('Subscribers');

        await db.runTransaction(async (transaction) => {
            return transaction.get(SubscribersRef).then(async (doc) => {
                if (!doc.exists) {
                    throw new Error("Document 'Subscribers' does not exist!");
                }
                
                const querySnapshot = await doc.ref.collection('UnactivatedUsers')
                .doc('discord-stage')
                .collection('unactivated-discord')
                .where('email', '==', email)
                .get();
                

                if (querySnapshot.size === 1) {
                    throw new Errors.EmailAlreadySent('This email was already sent!')
                }

                doc.ref.collection('UnactivatedUsers')
                .doc('discord-stage')
                .collection('unactivated-discord')
                .doc(email)
                .set(USER_DATA)
            });
        });

        res.status(200).send({
            message: 'User created!',
            LICENSE_KEY: LICENSE_KEY,
        });
    } catch (error) {
        if (error instanceof Errors.BannedUserError) {
            console.error(error);
            return res.status(409).send({
                message: error.message,
                error: 'BannedUserError',
            });
        } else if (error instanceof Errors.UserAlreadyExistError) {
            console.error(error);
            return res.status(409).send({
                message: error.message,
                error: 'UserAlreadyExistError',
            });
        } else if (error instanceof Errors.UserAlreadyExistManyTimes) {
            console.error(error);
            return res.status(409).send({
                message: error.message,
                error: 'UserAlreadyExistManyTimes',
            });
        } else if (error instanceof Errors.UserCapReachedError) {
            console.error(error);
            return res.status(409).send({
                message: error.message,
                error: 'UserCapReachedError',
            });
        } else {
            return res.status(500).send({
                message: error.message,
                error: 'internalError',
            });
        }
    }
};


export const ActivateDiscord = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors);
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const { discord, L_KEY } = req.body;


    try {
        const db = new Firestore();

        const ListUnactivatedDiscordDocuments = await db.collection('Users')
        .doc('Subscribers')
        .collection('UnactivatedUsers')
        .doc('discord-stage')
        .collection('unactivated-discord')
        .listDocuments();

        let found = false;

        (await Promise.all(ListUnactivatedDiscordDocuments)).map(async (docRef) => {


            const doc: any = await docRef.get();
            const data: any = doc.data();
            
            const match = await bcrypt.compare(L_KEY, data.LICENSE_KEY);

            console.log(data, match);

            if (match) {
                data.discord = discord;
                console.log('\n\n\n');
                console.log(data);

                try {

                    await docRef.delete();
                    await db.collection('Users')
                    .doc('Subscribers')
                    .collection('UnactivatedUsers')
                    .doc('electron-stage')
                    .collection('unactivated-electron')
                    .doc(data.email)
                    .set(data);
                } catch (error) {
                    throw new Errors.UnableActivateDiscordStage('Could not activate discord account.')
                }
                

                return res.status(200).send({
                    message: 'Discord is activated!',
                    L_KEY: L_KEY,
                    discord: discord
                })
            }


        })

        res.setTimeout(1000*10, () => {
            return res.status(404).send({
                message: 'License key not found!',
                error: 'LicenseKeyNotFound'
            })
        });


    } catch (error) {
        if (error instanceof Errors.LicenseKeyNotFound) {
            return res.status(404).send({
                message: error.message,
                error: 'LicenseKeyNotFound'
            })
        }

        if (error instanceof Errors.UnableActivateDiscordStage) {
            return res.status(500).send({
                message: error.message,
                error: 'UnableActivateDiscordStage'
            })
        }

    }
}

/**
 * Activates the license key and puts the user in the activated collection.
 * Once this happens, the system data is binded and the user can only use the system he used
 * to activate the license.
 * @param req
 * @param res
 */
export const ActivateLicenseBot = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors);
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const { L_KEY, SYSTEM_KEY } = req.body;

    try {

        const db = new Firestore();

        const ListUnactivatedElectronDocuments = await db.collection('Users')
        .doc('Subscribers')
        .collection('UnactivatedUsers')
        .doc('electron-stage')
        .collection('unactivated-electron')
        .listDocuments();

        (await Promise.all(ListUnactivatedElectronDocuments)).map(async (docRef) => {


            const doc: any = await docRef.get();
            const data: any = doc.data();


            
            const match = await bcrypt.compare(L_KEY, data.LICENSE_KEY);

            console.log(data, match);

            if (match) {
                console.log('\n\n\n');
                console.log(data);

                try {
                    data.SYSTEM_KEY = SYSTEM_KEY;
                    await docRef.delete();
                    await db.collection('Users')
                    .doc('Subscribers')
                    .collection('ActivatedSubscribers')
                    .doc(data.user_id)
                    .set(data);
                } catch (error) {
                    throw new Errors.UnableActivateElectronStage('Could not activate electron account.')
                }
                

                return res.status(200).send({
                    message: 'Key binded with application!',
                    L_KEY: L_KEY,
                    discord: data.discord
                })
            }


        })

        res.setTimeout(1000*10, () => {
            return res.status(404).send({
                message: 'License key not found!',
                error: 'LicenseKeyNotFound'
            })
        });

    } catch (error) {
        if (error instanceof Errors.LicenseKeyNotFound) {
            return res.status(404).send({
                message: error.message,
                error: 'LicenseKeyNotFound',
            });
        } else if (error instanceof Errors.LicenseKeyNotFound) {
            return res.status(404).send({
                message: error.message,
                error: 'LicenseKeyNotFound',
            });
        } else if (error instanceof Errors.UnableActivateElectronStage) {
            return res.status(409).send({
                message: error.message,
                error: 'UnableActivateElectronStage',
            });
        } else if (error instanceof Errors.UserNotFoundError) {
            return res.status(404).send({
                message: error.message,
                error: 'UserNotFoundError',
            });
        }
        return res.status(500).send({
            message: error.message,
            error: 'internalError',
        });
    }
};

/**
 * Used to validate the system in which the license was activated. This also checks the license.
 * @param req system data and license
 * @param res
 */
export const ValidateSystemLicense = async (req: Request, res: Response) => {
    const { SYSTEM_KEY } = req.body;

    try {
        const db = new Firestore();
        const querySnapshot = await db
            .collection('Users')
            .doc('Subscribers')
            .collection('ActivatedSubscribers')
            .where('SYSTEM_KEY', '==', SYSTEM_KEY)
            .get();

        if (querySnapshot.size === 1) {
            res.status(200).send({
                message: 'UserFound',
            });
        } else {
            throw new Error('not found');
        }
    } catch (error) {
        res.status(402).send('Not yet implemented');
    }
};

export const AddLogActivity = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors);
        res.status(422).json({ errors: errors.array() });
        return;
    }
    const { isLogIn, SYSTEM_KEY } = req.body;

    try {
        const db = new Firestore();

        const docRef = await db.collection('Users').doc('Subscribers').collection('ActivatedSubscribers').doc(SYSTEM_KEY).get();

        if (!docRef.exists) {
            const VisitorDocRef = await db.collection('Visitors').doc(SYSTEM_KEY).get();
            let data: any = VisitorDocRef.data();

            if (!data) {
                data = {};
            }

            data[Date.now().toString()] = {
                time: new Date().toString(),
            };

            await VisitorDocRef.ref.set(data);

            return res.status(200).send({
                message: 'New visitor',
            });
        } else {
            const dateObj = new Date();
            const docName = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

            const userDocRef = await docRef.ref.collection('logs').doc(docName).get();

            let data = userDocRef.data();
            if (!data) {
                data = {};
            }

            data[Date.now().toString()] = {
                isLogIn: isLogIn ? 'Log in' : 'Log off',
                time: dateObj.toString(),
            };

            userDocRef.ref.set(data);

            return res.status(200).send({
                message: 'Log added!',
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            error: 'internalError',
        });
    }
};
