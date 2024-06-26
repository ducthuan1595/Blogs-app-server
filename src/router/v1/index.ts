import express, { Express } from "express";

import userRouter from './user.router';
import otpRouter from './otp.router';

const router = express.Router();

router.use('/auth', userRouter);
router.use('/otp', otpRouter);

export default router;
