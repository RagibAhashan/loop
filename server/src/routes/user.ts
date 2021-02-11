import { Request, Response } from 'express';
import { Firestore } from "@google-cloud/firestore";
import { validationResult } from "express-validator";
import * as EmailService from '../services/email'
import * as Errors from '../services/errors'
import { v4 as uuidv4 } from "uuid";

// import bcrypt from 'bcrypt';
// const saltRounds = 10;


export const requestRegistrationEmail = async (req: Request, res: Response) => {
    res.status(500).json({ message: 'Not yet coded lol' });
}

export const CreateNewUser = async (req: Request, res: Response) => {
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
        const USER_DATA = {
            "credit_card": credit_card,
            "cvc": cvc,
            "discord_id": discord_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "CC_Month": CC_Month,
            "CC_Year": CC_Year,
            "user_id": USER_ID,
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



export const testing = async (req: Request, res: Response) => {
    res.status(200).send("Welcome to our server. (Test)")
}