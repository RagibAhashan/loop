import axios from 'axios';
import { Firestore } from '@google-cloud/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Direction } from '../routes/constants/LicenseConstants';


const License = (LICENSE_KEY: string, STRIPE_EMAIL: string) => {
    return {
        "LICENSE_KEY": LICENSE_KEY,
        "STAGE": Direction.FREE,
        "STRIPE_EMAIL": STRIPE_EMAIL,
        "USER": {
            "DISCORD_ID": "",
            "DISCORD_EMAIL": "",
            "FULL_NAME": ""
        }
    }
}

export const GenerateLicense = async (STRIPE_EMAIL: string) => {
    const LICENSE_KEY = uuidv4().toUpperCase();
    const db = new Firestore();
    try {
        await db
        .collection('LICENSE')
        .doc(LICENSE_KEY)
        .set(License(LICENSE_KEY, STRIPE_EMAIL));
    } catch(error) {
        throw new Error('Could not generate new license');
    }
}


