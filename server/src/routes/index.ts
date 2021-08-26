import { json } from 'body-parser';
import { Router } from 'express';
import * as Discord from './discord';
import * as Events from './events';
import * as User from './user';


const router = Router();
const jsonParser = json();


// USER REQUESTS.
router.post('/user/register/', jsonParser, User.RegisterUser);
router.post('/user/validateSystem', jsonParser, User.ValidateSystemLicense);
router.post('/user/activatekey/', jsonParser, User.ActivateUserLicense);

// USER ANALYTICS
router.post('/user/log/', jsonParser, User.AddLogActivity);
router.post('/events/tasks/', jsonParser, Events.AddManyTaskEvents);

// Discord
router.get('/redirect', jsonParser, Discord.Authorize);

export default router;
