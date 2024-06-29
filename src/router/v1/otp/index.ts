import express from 'express';

import { verifyOtp, sendAgainOtp } from '../../../controller/otp.controller';
import limiterRequest from '../../../middleware/limiter.middleware';

const router = express.Router();

router.post('/verify', verifyOtp);
router.post('/sent-otp', limiterRequest, sendAgainOtp);

export default router;