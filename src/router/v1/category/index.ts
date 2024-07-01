import express from 'express';

import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../controller/categories.controller';
import {authentication} from '../../../middleware/auth.middleware';

const router = express.Router();

router.get("", getCategories);

router.use(authentication);
router.post("", createCategory);
router.put("", updateCategory);
router.delete("", deleteCategory);

export default router;