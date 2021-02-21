import { Router } from 'express';
import * as User from './user';
import * as Events from './events';
import * as Discord from './Discord/discord';
import passport from 'passport';

import { json } from 'body-parser';

const router = Router();
const jsonParser = json();



const DiscordStrategy = require('passport-discord').Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify', 'guilds']
}, (accessToken: any, refreshToken: any, profile: any, done: any) => {
    console.log(accessToken);
    console.log(refreshToken)
    console.log(profile)
    console.log(done)
}));





// USER REQUESTS.
router.post('/user/validateSystem', jsonParser, User.ValidateSystemLicense);
router.post('/user/register/', jsonParser, User.RegisterUser);
router.post('/user/activatekey/', jsonParser, User.ActivateUserLicense);

// USER ANALYTICS
router.post('/user/log/', jsonParser, User.AddLogActivity);
router.post('/events/tasks/', jsonParser, Events.AddManyTaskEvents);


// DISCORD REQUESTS
router.get('/discord/oauth', passport.authenticate('discord', {
    'failureRedirect': '/forbidden'
}), Discord.Authenticate);

router.get('/oauth', passport.authenticate('discord', {
    'failureRedirect': '/forbidden'
}), Discord.Authenticate);


export default router;
