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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_auth_1 = __importDefault(require("../model/model.auth"));
const init_redis_1 = require("../dbs/init.redis");
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.access_token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const tokenId = req.cookies.access_token;
        const token = yield init_redis_1.redisClient.get(tokenId);
        const tokenSecret = process.env.JWT_SECRET_TOKEN;
        if (tokenSecret && token) {
            jsonwebtoken_1.default.verify(token, tokenSecret, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(401).json({ message: 'Token is expired' });
                }
                const user = yield model_auth_1.default.findById(data.id).select('-password');
                if (user) {
                    req.user = user;
                    next();
                }
            }));
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Token expired' });
    }
});
exports.default = authentication;
