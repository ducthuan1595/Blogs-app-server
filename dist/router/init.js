"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_auth_1 = require("../controller/controller.auth");
const controller_post_1 = require("../controller/controller.post");
const controller_category_1 = require("../controller/controller.category");
const controller_review_1 = require("../controller/controller.review");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = express_1.default.Router();
const init = (app) => {
    router.post('/v2/api/login', controller_auth_1.login);
    router.post("/v2/api/signup", controller_auth_1.signup);
    router.post("/v2/api/login-auth", controller_auth_1.loginAdmin);
    // Post
    router.get('/v1/api/posts', controller_post_1.getAllPost);
    router.get("/v1/api/posts-category", controller_post_1.getPostByCategory);
    router.get("/v1/api/posts-user", authentication_1.default, controller_post_1.getPostByUser);
    router.get("/v1/api/search", controller_post_1.searchPost);
    router.post("/v1/api/create-post", authentication_1.default, controller_post_1.createPost);
    router.put("/v1/api/update-post", authentication_1.default, controller_post_1.updatePost);
    router.delete("/v1/api/delete-post", authentication_1.default, controller_post_1.deletePost);
    router.get("/v1/api/post", controller_post_1.getPost);
    // // Category
    router.get("/v1/api/category", controller_category_1.getCategories);
    router.post("/v1/api/create-category", authentication_1.default, controller_category_1.createCategory);
    router.put("/v1/api/update-category", authentication_1.default, controller_category_1.updateCategory);
    router.delete("/v1/api/delete-category", authentication_1.default, controller_category_1.deleteCategory);
    // Review
    router.post('/v1/api/review', authentication_1.default, controller_review_1.createReview);
    return app.use("/", router);
};
exports.default = init;
