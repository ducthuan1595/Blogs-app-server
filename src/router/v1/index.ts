import express from "express";

import apiKey from "../../auth/apikey";
import userRouter from './user';
import otpRouter from './otp';
import commentRouter from './comment';
import blogRouter from './blog';
import likeRouter from './like';
import categoryRouter from './category';
import notifyRouter from './notification';
import viewRouter from './views';

const router = express.Router();

// router.use(apiKey);

router.use('/auth', userRouter);
router.use('/otp', otpRouter);
router.use('/blog', blogRouter);
router.use('/category', categoryRouter);
router.use('/comment', commentRouter);
router.use('/like', likeRouter);
router.use('/view', viewRouter);
router.use('/notify', notifyRouter);

export default router;
