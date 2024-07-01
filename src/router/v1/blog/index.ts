import express from 'express';

import {
    getAllPost,
    getPostByCategory,
    getPostByUser,
    getPost,
    updatePost,
    createPost,
    deletePost,
    searchPost,
  } from "../../../controller/blog.controller";
import { authentication } from '../../../middleware/auth.middleware'

const router = express.Router();

router.get('', getAllPost)
router.get("/category", getPostByCategory);
router.get("/detail-blog", getPost);
router.get("/search", searchPost);

router.use(authentication);
router.get("/user", getPostByUser);
router.post("", authentication, createPost);
router.put("", updatePost);
router.delete("", deletePost);

export default router;