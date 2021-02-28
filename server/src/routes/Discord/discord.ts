import { Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import { validationResult } from 'express-validator';
import passport from 'passport';


export const Authenticate = async (req: Request, res: Response) => {
    console.log('Authenticate', req.body);

    try {
        return res.send({
            'from' : 'server',
            profile: req.body
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            error: 'internalError',
        });
    }
};
