import express from 'express';

import { createComment, getComments } from '../../../controller/comment.controller';
import { authentication } from '../../../middleware/auth.middleware'

const router = express.Router();

router.post('', authentication, createComment);
router.get('', getComments);

export default router;