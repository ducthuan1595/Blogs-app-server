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
exports.getAllPostMiddleware = void 0;
const init_redis_1 = require("../../dbs/init.redis");
const redisType_1 = require("./redisType");
const pageSection_1 = require("../../support/pageSection");
const getAllPostMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        if (!page || !limit) {
            return res.status(404).json({ message: 'Not found' });
        }
        const data = yield init_redis_1.redisClient.get(redisType_1.GET_ALL_POST);
        if (data) {
            const posts = JSON.parse(data);
            const result = (0, pageSection_1.pageSection)(+page, +limit, posts);
            return res.status(201).json({
                message: "ok",
                data: {
                    posts: result.result,
                    totalPage: result.totalPage,
                    nextPage: +page * +limit < posts.length,
                    prevPage: 0 < +page - 1,
                    totalPosts: posts.length,
                    currPage: page,
                },
            });
        }
        next();
    }
    catch (err) {
        return res.status(500).json({ message: 'Error from server' });
    }
});
exports.getAllPostMiddleware = getAllPostMiddleware;
