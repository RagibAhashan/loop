import { Request, Response } from 'express';
import { Firestore } from "@google-cloud/firestore";
import { validationResult } from "express-validator";
import * as EmailService from '../services/email'
import * as Errors from '../services/errors'
import { v4 as uuidv4 } from "uuid";

const bcrypt = require('bcrypt');
const saltRounds = 10;



/**
 * Receives user data and holds the data in a collection temporary until the license key is 
 * activated for the very first time.
 * @param req body: user data
 * @param res body: license key
 */
export const RegisterUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors)
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        const { credit_card, cvc, discord_id, email, first_name, last_name, CC_Month, CC_Year } = req.body;
        const db = new Firestore();
        const USER_ID = uuidv4();
        const LICENSE_KEY = uuidv4();
        const HASHED_LKEY = await bcrypt.hash(LICENSE_KEY, saltRounds);
        const USER_DATA = {
            "billing": {
                "credit_card": credit_card,
                "cvc": cvc,
                "CC_Month": CC_Month,
                "CC_Year": CC_Year,
            },
            "system_information": {
                "CPU": "",
                "GPU": "",
                "MAC_ADDRESS": "",
                "OS": ""
            },
            "discord_id": discord_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "user_id": USER_ID,
            "LICENSE_KEY": HASHED_LKEY,
            "joined": { "Date": new Date().toString(), "unix" : Date.now() }
        }
        const BannedUsersRef    = db.collection("Users").doc("BannedUsers");
        const SubscribersRef    = db.collection("Users").doc("Subscribers");

        await db.runTransaction(async (transaction) => {
            
            return transaction.get(SubscribersRef).then( async (doc) => {
                if (!doc.exists) {
                    throw new Error("Document 'Subscribers' does not exist!");
                }
                
                let querySnapshot = await doc.ref.collection('UnactivatedSubscribers')
                .where("email", "==", email)
                .get();

                if (querySnapshot.size >= 1) {
                    throw new Errors.EmailAlreadySent('You have already received an email!');
                }

                querySnapshot = await doc.ref.collection('ActivatedSubscribers')
                .where("email", "==", email)
                .get();

                if (querySnapshot.size > 1) {
                    throw new Errors.UserAlreadyExistManyTimes(`This user exists ${querySnapshot.size} times`);
                } else if (querySnapshot.size === 1) {
                    throw new Errors.UserAlreadyExistError('This user already exist!');
                }

                if (querySnapshot.size > 1) {
                    throw new Errors.UserAlreadyExistManyTimes(`This user exists ${querySnapshot.size} times`);
                } else if (querySnapshot.size === 1) {
                    throw new Errors.UserAlreadyExistError('This user already exist!');
                }

                querySnapshot = await BannedUsersRef.collection('BannedList')
                .where("email", "==", email)
                .get();
                if (querySnapshot.size === 1) {
                    throw new Errors.BannedUserError('This user is banned!');
                }

                const subData: FirebaseFirestore.DocumentData | undefined = await (await SubscribersRef.get()).data();
                const snapshot: any = await SubscribersRef.collection('ActivatedSubscribers').get();
                const count: number = snapshot.size + 1;

                if(subData) {
                    if (subData.USER_CAP >= count) {
                        await SubscribersRef.collection('UnactivatedSubscribers').doc(USER_ID).set(USER_DATA);
                        SubscribersRef.update({
                            CURRENT_USERS: count
                        })
                    } else {
                        throw new Errors.UserCapReachedError('User cap reached!');
                    }
                }
                
            });
            
        });

        res.status(200).send({
            message: 'User created!',
            LICENSE_KEY: LICENSE_KEY,
        });
            
        } catch(error) {
            if (error instanceof Errors.BannedUserError) {
            console.error(error);
            return res.status(409).send({
                message: error.message,
                error: 'BannedUserError'
            });
        }
        else if (error instanceof Errors.UserAlreadyExistError) {
            console.error(error);
            return res.status(409).send({
                message: error.message,
                error: 'UserAlreadyExistError'
            });
        }
        else if (error instanceof Errors.UserAlreadyExistManyTimes) {
            console.error(error);
            return res.status(409).send({
                message: error.message,
                error: 'UserAlreadyExistManyTimes'
            });
        }
        else if (error instanceof Errors.UserCapReachedError) {
            console.error(error);
            return res.status(409).send({
                message: error.message,
                error: 'UserCapReachedError'
            });
        }
        else {
            console.log(error)
            return res.status(500).send({
                message: error.message,
                error: 'internalError'
            });
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
export const ActivateUserLicense = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors)
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const { L_KEY, CPU, GPU, MAC_ADDRESS, OS } = req.body;
    try {
        const db = new Firestore();
        const SubscribersRef = db.collection("Users").doc("Subscribers");

        await db.runTransaction(async (transaction) => {
            return transaction.get(SubscribersRef).then( async (doc) => {
                if (!doc.exists) {
                    throw new Error("Document 'SubscribersRef' does not exist!");
                }

                const listDocs = await doc.ref.collection('UnactivatedSubscribers').listDocuments();
                listDocs.map(async (doc) => {
                    const document = await doc.get();
                    const data = document.data();
                    if (data) {
                        const match = await bcrypt.compare(L_KEY, data.LICENSE_KEY)
                        console.log(data.LICENSE_KEY, L_KEY, ' == ', match)
                        data.system_information = {
                            "CPU": CPU,
                            "GPU": GPU,
                            "MAC_ADDRESS": MAC_ADDRESS,
                            "OS": OS
                        }
                        if (match) {
                            // TODO: Fail check (Try-Catch)
                            await document.ref.delete();
                            await SubscribersRef.collection('ActivatedSubscribers').doc(data.user_id).set(data);
                        }
                    }
                });
                throw new Errors.LicenseKeyNotFound('License key not found!');
                
            });
            
        });

        
            
        } catch(error) {
            if (error instanceof Errors.LicenseKeyNotFound) {
                return res.status(404).send({
                    message: error.message,
                    error: 'internalError'
                });
            }
            else if (error instanceof Errors.LicenseKeyNotFound) {
                return res.status(404).send({
                    message: error.message,
                    error: 'internalError'
                });
            }
            return res.status(500).send({
                message: error.message,
                error: 'internalError'
            });
        }
}

/**
 * Used to validate the system in which the license was activated. This also checks the license.
 * @param req system data and license
 * @param res 
 */
export const ValidateSystemLicense = async (req: Request, res: Response) => {
    res.status(500).send('Not yet implemented');
}