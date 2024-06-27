import express from "express";

import apiKey from "../../auth/apikey";
import userRouter from './user.router';
import otpRouter from './otp.router';
import commentRouter from './comment';

const router = express.Router();

// router.use(apiKey);

router.use('/auth', userRouter);
router.use('/otp', otpRouter);
router.use('/comment', commentRouter);

export default router;
