import express from "express";

import apiKey from "../../auth/apikey";
import userRouter from './user.router';
import otpRouter from './otp.router';

const router = express.Router();

// router.use(apiKey);

router.use('/auth', userRouter);
router.use('/otp', otpRouter);

export default router;
