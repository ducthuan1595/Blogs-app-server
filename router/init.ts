import express, { Express, Request, Response } from "express";

import { login, signup, loginAdmin } from "../controller/auth";
import {
  getAllPost,
  getPostByCategory,
  getPostByUser,
  getPost,
} from "../controller/post";
import { getCategories, updateCategory } from "../controller/category";
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
  // router.post(
  //   "/v1/api/create-post",
  //   authMiddware.protect,
  //   postController.createPost
  // );
  // router.put(
  //   "/v1/api/update-post",
  //   authMiddware.protect,
  //   postController.updatePost
  // );
  // router.delete(
  //   "/v1/api/delete-post",
  //   authMiddware.protect,
  //   postController.deletePost
  // );
  router.get("/v1/api/post", getPost);

  // // Category
  router.get("/v1/api/category", getCategories);
  // router.post(
  //   "/v1/api/create-category",
  //   authMiddware.protect,
  //   categoryController.createCategory
  // );
  router.put(
    "/v1/api/update-category",
    authentication,
    updateCategory
  );
  // router.delete(
  //   "/v1/api/delete-category",
  //   authMiddware.protect,
  //   categoryController.deleteCategory
  // );

  return app.use("/", router);
};

export default init;
