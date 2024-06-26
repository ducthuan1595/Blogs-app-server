import express from 'express';

import {login, signup} from '../../controller/user.controller';
import { authentication } from '../../middleware/auth.middleware'

const router = express.Router();

router.post('/login', login);
router.post("/signup", signup);

export default router;