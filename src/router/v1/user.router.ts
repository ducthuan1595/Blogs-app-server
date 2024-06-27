import express from 'express';

import {login, signup, logout} from '../../controller/user.controller';
import { authentication } from '../../middleware/auth.middleware'

const router = express.Router();

router.post('/login', login);
router.post("/signup", signup);
router.post("/logout", logout);

export default router;