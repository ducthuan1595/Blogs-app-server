import express from 'express';

import {login, signup, logout, refreshToken} from '../../controller/user.controller';
import { authentication } from '../../middleware/auth.middleware'

const router = express.Router();

router.post('/login', login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;