import express from 'express';

import { createComment, getComments, deleteComment } from '../../../controller/comment.controller';
import { authentication } from '../../../middleware/auth.middleware'

const router = express.Router();

router.get('', getComments);

router.use(authentication);
router.post('', createComment);
router.delete('', deleteComment);

export default router;