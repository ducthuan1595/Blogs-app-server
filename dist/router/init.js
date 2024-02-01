"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const post_1 = require("../controller/post");
const router = express_1.default.Router();
const init = (app) => {
    router.post('/v2/api/login', auth_1.login);
    router.post("/v2/api/signup", auth_1.signup);
    router.get('/v1/api/posts', post_1.getAllPost);
    return app.use("/", router);
};
exports.default = init;
