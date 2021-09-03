import { json } from 'body-parser';
import { Router } from 'express';
import * as Discord from './discord';
import * as Events from './events';
import * as User from './user';
import * as License from './license';

const router = Router();
const jsonParser = json();

// USER REQUESTS.
router.get('/', jsonParser, (req, res) => {
    (req.session as any)['access_token'] = 'asda';
    console.log(req.sessionID);
    res.send('ok');
});

router.post('/user/register/', jsonParser, User.RegisterUser);
router.post('/user/validateSystem', jsonParser, User.ValidateSystemLicense);
router.post('/user/activatekey/', jsonParser, User.ActivateUserLicense);

// USER ANALYTICS
router.post('/user/log/', jsonParser, User.AddLogActivity);
router.post('/events/tasks/', jsonParser, Events.AddManyTaskEvents);

// Discord
router.post('/buyLicense', jsonParser, License.BuyLicense);
router.get('/oauth', jsonParser, Discord.GetDiscordUserInformation);
router.post('/discordbind/', jsonParser, License.LicenseBind);

export default router;
