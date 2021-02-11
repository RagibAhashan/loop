import { Request, Response } from 'express';
import { Firestore } from "@google-cloud/firestore";
import { validationResult } from "express-validator";
import * as EmailService from '../services/email'
import * as Errors from '../services/errors'
import { v4 as uuidv4 } from "uuid";

const bcrypt = require('bcrypt');
const saltRounds = 10;


export const requestRegistrationEmail = async (req: Request, res: Response) => {
    res.status(500).json({ message: 'Not yet coded lol' });
}

const A_KEY = 'a7791cf4-33dd-42c5-a0f1-204aefb494c0';

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
            "KEY_ACTIVATED": false,
            "joined": { "Date": new Date().toString(), "unix" : Date.now() }
        }
        const BannedUsersRef        = db.collection("Users").doc("BannedUsers");
        const SubscribedUsersRef    = db.collection("Users").doc("SubscribedUsers");

        await db.runTransaction(async (transaction) => {
            
            return transaction.get(SubscribedUsersRef).then( async (doc) => {
                if (!doc.exists) {
                    throw new Error("Document 'SubscribedUsersRef' does not exist!");
                }
                
                let querySnapshot = await doc.ref.collection('Subscribers')
                .where("email", "==", email)
                .get();

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

                // Put user data.
                SubscribedUsersRef.collection('Subscribers').doc(USER_ID).set(USER_DATA);
            });
            
        });

        res.status(200).send({
            message: 'User created!',
            user_id: USER_ID,
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
        else {
            console.log(error)
            return res.status(500).send({
                message: error.message,
                error: 'internalError'
            });
        }
    }
}

export const ActivateUserLicense = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors)
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const { L_KEY, CPU, GPU, MAC_ADDRESS, OS } = req.body;

    try {

    } catch (error) {

    }

    res.status(200).send(req.body);
}


export const testing = async (req: Request, res: Response) => {
    res.status(200).send(req.body);
}