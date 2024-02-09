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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostService = exports.createPostService = exports.updatePostService = exports.getPostService = exports.getPostByUserService = exports.getPostByCategoryService = exports.getPosts = void 0;
const post_1 = __importDefault(require("../model/post"));
const category_1 = __importDefault(require("../model/category"));
const pageSection_1 = require("../support/pageSection");
const cloudinary_1 = require("../utils/cloudinary");
const getPosts = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield category_1.default.find();
        const posts = yield post_1.default.find()
            .populate("userId", "-password")
            .populate("categoryId")
            .sort({ updatedAt: -1 })
            .lean();
        const data = (0, pageSection_1.pageSection)(page, limit, posts);
        return {
            status: 201,
            message: "ok",
            data: {
                posts: data.result,
                totalPage: data.totalPage,
                nextPage: page * limit < posts.length,
                prevPage: 0 < page - 1,
                totalPosts: posts.length,
                currPage: page,
            },
        };
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server',
            data: [],
        };
    }
});
exports.getPosts = getPosts;
const getPostByCategoryService = (page, limit, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find({ categoryId }).populate('userId', '-password').populate('categoryId').sort({ updatedAt: -1 }).lean();
        const data = (0, pageSection_1.pageSection)(page, limit, posts);
        return {
            status: 201,
            message: "ok",
            data: {
                posts: data.result,
                totalPage: data.totalPage,
                nextPage: page * limit < posts.length,
                prevPage: 0 < page - 1,
                totalPosts: posts.length,
                currPage: page,
            },
        };
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.getPostByCategoryService = getPostByCategoryService;
const getPostByUserService = (page, limit, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find({ userId: user._id }).sort({ updatedAt: -1 }).lean();
        const data = (0, pageSection_1.pageSection)(page, limit, posts);
        return {
            status: 201,
            message: "ok",
            data: {
                posts: data.result,
                totalPage: data.totalPage,
                nextPage: page * limit < posts.length,
                prevPage: 0 < page - 1,
                totalPosts: posts.length,
                currPage: page,
            },
        };
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.getPostByUserService = getPostByUserService;
const getPostService = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findById(postId).populate('categoryId').populate('userId', '-password');
        return {
            status: 201,
            message: 'ok',
            data: post
        };
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.getPostService = getPostService;
const updatePostService = (request, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield post_1.default.findById(request.postId);
        if (post && ((_a = post.userId) === null || _a === void 0 ? void 0 : _a.toString()) === user._id.toString()) {
            post.title = request.title;
            post.description = request.desc;
            post.categoryId = request.categoryId;
            if (request.image.length) {
                for (let img of post.image) {
                    if (img && img.public_id) {
                        yield (0, cloudinary_1.destroyClodinary)(img.public_id);
                    }
                }
                post.image = request.image;
            }
            yield post.save();
            return {
                status: 201,
                message: "ok",
            };
        }
    }
    catch (err) {
        return {
            status: 500,
            message: "Error from server",
        };
    }
});
exports.updatePostService = updatePostService;
const createPostService = (request, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = new post_1.default({
            title: request.title,
            desc: request.desc,
            userId: user._id,
            image: request.image,
            categoryId: request.categoryId,
        });
        yield post.save();
        return {
            status: 200,
            message: 'ok'
        };
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.createPostService = createPostService;
const deletePostService = (postId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // const posts = await Post.deleteOne({_id: postId, userId: user._id});
        const post = yield post_1.default.findById(postId);
        if (post && (((_b = post.userId) === null || _b === void 0 ? void 0 : _b.toString()) === user._id.toString() || user.role === 'F2')) {
            for (let img of post.image) {
                if (img && img.public_id) {
                    yield (0, cloudinary_1.destroyClodinary)(img.public_id);
                }
            }
            yield post_1.default.findByIdAndDelete(postId);
            return {
                status: 200,
                message: 'ok'
            };
        }
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.deletePostService = deletePostService;
