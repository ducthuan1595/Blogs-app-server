"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createToken(id) {
    if (process.env.JWT_SECRET_TOKEN) {
        return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: "30s",
        });
    }
}
exports.createToken = createToken;
function createRefreshToken(id) {
    if (process.env.JWT_SECRET_REFRESH_TOKEN) {
        return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
            expiresIn: "1h",
        });
    }
}
exports.createRefreshToken = createRefreshToken;
