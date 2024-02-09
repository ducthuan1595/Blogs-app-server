import express, { Express, Request, Response } from "express";

import { login, signup, loginAdmin } from "../controller/auth";
import {
  getAllPost,
  getPostByCategory,
  getPostByUser,
  getPost,
  updatePost,
  createPost,
  deletePost,
} from "../controller/post";
import {
  getCategories,
  updateCategory,
  createCategory,
  deleteCategory,
} from "../controller/category";
import authentication from "../middleware/authentication";

const router = express.Router();

const init = (app: Express) => {

  router.post('/v2/api/login', login);
  router.post("/v2/api/signup", signup);
  router.post("/v2/api/login-auth", loginAdmin);

  // Post
  router.get('/v1/api/posts', getAllPost)
  router.get("/v1/api/posts-category", getPostByCategory);
  router.get(
    "/v1/api/posts-user",
    authentication,
    getPostByUser
  );
  // router.get("/v1/api/search", postController.searchPost);
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

  // // Category
  router.get("/v1/api/category", getCategories);
  router.post(
    "/v1/api/create-category",
    authentication,
    createCategory
  );
  router.put(
    "/v1/api/update-category",
    authentication,
    updateCategory
  );
  router.delete(
    "/v1/api/delete-category",
    authentication,
    deleteCategory
  );

  return app.use("/", router);
};

export default init;
