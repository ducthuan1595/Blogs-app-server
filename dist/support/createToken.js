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
exports.createRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const init_redis_1 = require("../dbs/init.redis");
function createToken(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.JWT_SECRET_TOKEN) {
            const tokenCounter = yield init_redis_1.redisClient.get('tokenCouter');
            yield init_redis_1.redisClient.set("tokenCouter", parseInt(tokenCounter) + 1);
            let key = (parseInt(tokenCounter) + 1).toString();
            const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET_TOKEN, {
                expiresIn: '300s'
            });
            // save token to redis store
            yield init_redis_1.redisClient.set(key, token);
            return key;
        }
    });
}
exports.createToken = createToken;
function createRefreshToken(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.JWT_SECRET_REFRESH_TOKEN) {
            const tokenCounter = yield init_redis_1.redisClient.get('tokenCouter');
            yield init_redis_1.redisClient.set("tokenCouter", parseInt(tokenCounter) + 1);
            let key = (parseInt(tokenCounter) + 1).toString();
            const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
                expiresIn: '300s'
            });
            // save token to redis store
            yield init_redis_1.redisClient.set(key, token);
            return key;
        }
    });
}
exports.createRefreshToken = createRefreshToken;
