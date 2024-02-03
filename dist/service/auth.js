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
exports.registerServer = exports.loginAdminService = exports.loginService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const createToken_1 = __importDefault(require("../support/createToken"));
const auth_1 = __importDefault(require("../model/auth"));
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_1.default.findOne({ email: email });
        if (!user) {
            return {
                status: 401,
                message: 'User is not exist'
            };
        }
        const validPw = yield bcrypt_1.default.compare(password, user.password);
        if (!validPw) {
            return {
                status: 401,
                message: 'Password is incorrect'
            };
        }
        user.password = '';
        const data = {
            user,
            token: (0, createToken_1.default)(user._id.toString())
        };
        return {
            status: 201,
            message: "ok",
            data: data,
        };
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.loginService = loginService;
const loginAdminService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_1.default.findOne({ email: email });
        if (!user || user.role !== 'F2') {
            return {
                status: 403,
                message: "Unauthorized",
            };
        }
        const validPw = yield bcrypt_1.default.compare(password, user.password);
        if (!validPw) {
            return {
                status: 401,
                message: "Password is incorrect",
            };
        }
        user.password = "";
        const data = {
            user,
            token: (0, createToken_1.default)(user._id.toString()),
        };
        return {
            status: 201,
            message: "ok",
            data: data,
        };
    }
    catch (err) {
        return {
            status: 500,
            message: "Error from server",
        };
    }
});
exports.loginAdminService = loginAdminService;
const registerServer = (email, password, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_1.default.findOne({ email: email });
        if (user) {
            return {
                status: 403,
                message: 'Email was exist'
            };
        }
        const pw = yield bcrypt_1.default.hash(password, 12);
        const newUser = new auth_1.default({
            username,
            email,
            password: pw
        });
        yield newUser.save();
        return {
            status: 200,
            message: 'ok',
        };
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.registerServer = registerServer;
