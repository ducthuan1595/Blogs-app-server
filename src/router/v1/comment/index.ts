import express from 'express';

import { createComment, getComments, deleteComment } from '../../../controller/comment.controller';
import { authentication } from '../../../middleware/auth.middleware'

const router = express.Router();

router.post('', authentication, createComment);
router.get('', getComments);
router.delete('', authentication, deleteComment);

export default router;