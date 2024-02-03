"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const post_1 = require("../controller/post");
const category_1 = require("../controller/category");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = express_1.default.Router();
const init = (app) => {
    router.post('/v2/api/login', auth_1.login);
    router.post("/v2/api/signup", auth_1.signup);
    router.post("/v2/api/login-auth", auth_1.loginAdmin);
    // Post
    router.get('/v1/api/posts', post_1.getAllPost);
    router.get("/v1/api/posts-category", post_1.getPostByCategory);
    router.get("/v1/api/posts-user", authentication_1.default, post_1.getPostByUser);
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
    router.get("/v1/api/post", post_1.getPost);
    // // Category
    router.get("/v1/api/category", category_1.getCategories);
    // router.post(
    //   "/v1/api/create-category",
    //   authMiddware.protect,
    //   categoryController.createCategory
    // );
    router.put("/v1/api/update-category", authentication_1.default, category_1.updateCategory);
    // router.delete(
    //   "/v1/api/delete-category",
    //   authMiddware.protect,
    //   categoryController.deleteCategory
    // );
    return app.use("/", router);
};
exports.default = init;
