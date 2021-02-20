import { Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import { validationResult } from 'express-validator';
import * as EmailService from '../services/email';
import * as Errors from '../services/errors';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Receives user data and holds the data in a collection temporary until the license key is
 * activated for the very first time.
 * @param req body: user data
 * @param res body: license key
 */
export const AddManyTaskEvents = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors);
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        const { item, amountTasks, SYSTEM_KEY } = req.body;
        const db = new Firestore();

        const UserDocRef = await db.collection('Users').doc('Subscribers').collection('ActivatedSubscribers').doc(SYSTEM_KEY).get();

        const dateObj = new Date();
        const docName = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

        const EventDocRef = await UserDocRef.ref.collection('TaskEvents').doc(docName).get();
        let data = EventDocRef.data();
        if (!data) {
            data = {};
        }

        data[Date.now().toString()] = {
            item: item,
            amountTasks: amountTasks,
        };

        await EventDocRef.ref.set(data);

        res.status(200).send({
            message: 'Event added!',
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            error: 'internalError',
        });
    }
};
