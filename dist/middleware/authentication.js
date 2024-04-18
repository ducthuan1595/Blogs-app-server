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
const auth_1 = __importDefault(require("../model/auth"));
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const tokenSecret = process.env.JWT_SECRET;
            if (tokenSecret) {
                const decode = jsonwebtoken_1.default.verify(token, tokenSecret);
                if (decode && decode.id) {
                    const user = yield auth_1.default.findById(decode.id).select('-password');
                    if (user) {
                        req.user = user;
                        next();
                    }
                }
                else {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Token expired' });
        }
    }
    else {
        return res.status(400).json({ message: 'Not found token' });
    }
});
exports.default = authentication;
