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
exports.getPosts = void 0;
const post_1 = __importDefault(require("../model/post"));
const pageSection_1 = require("../support/pageSection");
const getPosts = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('click');
        const posts = yield post_1.default.find()
            .populate("userId", "-password")
            .populate("categoryId");
        // .sort({updatedAt: -1});
        console.log(posts);
        const data = (0, pageSection_1.pageSection)(page, limit, posts);
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
