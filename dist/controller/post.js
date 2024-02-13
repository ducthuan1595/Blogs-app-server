"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPost = exports.deletePost = exports.createPost = exports.updatePost = exports.getPost = exports.getPostByUser = exports.getPostByCategory = exports.getAllPost = void 0;
const post_1 = require("../service/post");
const getAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    if (page && limit) {
        const data = yield (0, post_1.getPosts)(+page, +limit);
        if (data) {
            return res.status(data.status).json({ message: data.message, data: data.data });
        }
    }
});
exports.getAllPost = getAllPost;
const getPostByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, page, limit } = req.query;
    if (!categoryId || !page || !limit) {
        return res.status(400).json({ message: 'Not found' });
    }
    const { status, message, data } = yield (0, post_1.getPostByCategoryService)(+page, +limit, categoryId.toString());
    return res.status(status).json({ message, data });
});
exports.getPostByCategory = getPostByCategory;
const getPostByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    if (req.user && page && limit) {
        const data = yield (0, post_1.getPostByUserService)(+page, +limit, req.user);
        if (data) {
            return res.status(data.status).json({ message: data.message, data: data.data });
        }
    }
});
exports.getPostByUser = getPostByUser;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.query.postId;
    if (!postId) {
        return res.status(404).json({ message: 'Not found' });
    }
    const data = yield (0, post_1.getPostService)(postId.toString());
    if (data) {
        return res.status(data.status).json({ message: data.message, data: data.data });
    }
});
exports.getPost = getPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = req.body;
    if (!request.postId || !request.desc || !request.title || !request.categoryId || !req.user) {
        return res.status(404).json({ message: 'Not found' });
    }
    const data = yield (0, post_1.updatePostService)(request, req.user);
    if (data) {
        return res.status(data.status).json({ message: data.message });
    }
});
exports.updatePost = updatePost;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = req.body;
    if (!request.desc ||
        !request.title ||
        !request.categoryId ||
        !request.image ||
        !req.user) {
        return res.status(404).json({ message: "Not found" });
    }
    const data = yield (0, post_1.createPostService)(request, req.user);
    if (data) {
        return res.status(data.status).json({ message: data.message });
    }
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.query.postId;
    if (!postId || !req.user) {
        return res.status(404).json({ message: 'Not found' });
    }
    const data = yield (0, post_1.deletePostService)(postId.toString(), req.user);
    if (data) {
        return res.status(data.status).json({ message: data.message });
    }
});
exports.deletePost = deletePost;
const searchPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    if (!search) {
        return res.status(400).json({ message: 'Not found' });
    }
    const data = yield (0, post_1.searchPostService)(search.toString());
    if (data) {
        return res.status(data.status).json({ message: data.message, data: data.data });
    }
});
exports.searchPost = searchPost;
