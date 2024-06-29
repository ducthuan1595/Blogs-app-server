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

  // Post
router.get('', getAllPost)
router.get("/v1/api/posts-category", getPostByCategory);
router.get(
"/v1/api/posts-user",
authentication,
getPostByUser
);
router.get("/v1/api/search", searchPost);
router.post("/v1/api/create-post", authentication, createPost);
router.put(
"/v1/api/update-post",
authentication,
updatePost
);
router.delete(
"/v1/api/delete-post",
authentication,
deletePost
);
router.get("/v1/api/post", getPost);

export default router;