import { Router } from 'express';
import * as User from './user';

import { json } from 'body-parser';


const router = Router();
const jsonParser = json();

// USER REQUESTS.
router.get('/', jsonParser, User.ValidateSystemLicense);
router.post('/user/register/', jsonParser, User.RegisterUser);
router.post('/user/activatekey/', jsonParser, User.ActivateUserLicense);

export default router;