import express from "express";

import apiKey from "../../auth/apikey";
import userRouter from './user';
import otpRouter from './otp';
import commentRouter from './comment';
import blogRouter from './blog';

const router = express.Router();

// router.use(apiKey);

router.use('/auth', userRouter);
router.use('/otp', otpRouter);
router.use('/blog', blogRouter);
router.use('/comment', commentRouter);

export default router;
