import { Router } from 'express';
import * as User from './user';

import { json } from 'body-parser';


const router = Router();
const jsonParser = json();

router.get('/', User.testing);


// USER REQUESTS.
router.post('/user/', jsonParser, User.requestRegistrationEmail);

export default router;