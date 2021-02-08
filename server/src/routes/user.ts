import { Request, Response } from 'express';
import { Firestore } from "@google-cloud/firestore";
import { validationResult } from "express-validator";
import * as EmailService from '../services/email'
import { v4 as uuidv4 } from "uuid";

const bcrypt = require('bcrypt');
const saltRounds = 10;


export const requestRegistrationEmail = async (req: Request, res: Response) => {
    res.status(500).json({ message: 'Not yet coded lol' });
}



export const testing = async (req: Request, res: Response) => {
    res.status(200).send("Welcome to our server. (Test)")
}