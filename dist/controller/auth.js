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
exports.signup = exports.loginAdmin = exports.login = void 0;
const auth_1 = require("../service/auth");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({ message: 'Not found' });
    }
    const data = yield (0, auth_1.loginService)(email, password);
    if (data) {
        res.status(data.status).json({ message: data.message, data: data.data });
    }
});
exports.login = login;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({ message: "Not found" });
    }
    const data = yield (0, auth_1.loginAdminService)(email, password);
    if (data) {
        res.status(data.status).json({ message: data.message, data: data.data });
    }
});
exports.loginAdmin = loginAdmin;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(404).json({ message: 'Not found' });
    }
    const data = yield (0, auth_1.registerServer)(email, password, username);
    if (data) {
        res.status(data.status).json({ message: data.message });
    }
});
exports.signup = signup;
