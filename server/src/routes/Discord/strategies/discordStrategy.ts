const DiscordStrategy = require('passport-discord').Strategy
import passport from 'passport';


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