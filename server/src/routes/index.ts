import { Router } from 'express';
import * as User from './user';
import * as Events from './events';

import { json } from 'body-parser';

const router = Router();
const jsonParser = json();

// USER REQUESTS.
router.post('/user/validateSystem', jsonParser, User.ValidateSystemLicense);
router.post('/user/register/', jsonParser, User.RegisterUser);
router.post('/user/activatekey/', jsonParser, User.ActivateUserLicense);

// USER ANALYTICS
router.post('/user/log/', jsonParser, User.AddLogActivity);
router.post('/events/tasks/', jsonParser, Events.AddManyTaskEvents);

export default router;
