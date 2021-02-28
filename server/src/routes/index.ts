import { response, Router } from 'express';
import * as User from './user';
import * as Events from './events';
import * as Discord from './Discord/discord';
import passport from 'passport';
import axios from 'axios';
import { Request, Response } from 'express';

import { json } from 'body-parser';

const router = Router();
const jsonParser = json();



const DiscordStrategy = require('passport-discord').Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://127.0.0.1:4000/redirect', //process.env.CLIENT_REDIRECT,
    scope: ['identify', 'email']
}, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
//    console.log(refreshToken)
    console.log(profile)


    try {
        const response = await axios.post('http://127.0.0.1:4000/redirect-info', profile);
        console.log(response.data);
    } catch (error) {
        throw new Error('wtf just happened')
    }
    
    done(JSON.stringify(profile));
}));

// USER REQUESTS.
router.post('/user/payment/', jsonParser, User.UserPaymentLicenseKey);
router.post('/user/register/', jsonParser, User.RegisterUser);
router.post('/user/activate-discord/', jsonParser, User.ActivateDiscord);
router.post('/user/activate-electron/', jsonParser, User.ActivateLicenseBot);
router.post('/user/validateSystem', jsonParser, User.ValidateSystemLicense);

// USER ANALYTICS
router.post('/user/log/', jsonParser, User.AddLogActivity);
router.post('/events/tasks/', jsonParser, Events.AddManyTaskEvents);


// DISCORD REQUESTS
router.get('/oauth', passport.authenticate('discord'));

router.get('/redirect', passport.authenticate('discord', {
    'failureRedirect': '/forbidden',
    'successRedirect': '/'
}), (_, res) => {
    res.redirect('https://google.ca');
});

router.get('/', (_, res) => {
    res.redirect('https://google.ca');
});


router.post('/redirect-info', jsonParser ,Discord.Authenticate);


export default router;
