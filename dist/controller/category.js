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
exports.deleteCategory = exports.createCategory = exports.updateCategory = exports.getCategories = void 0;
const category_1 = require("../service/category");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, message, data } = yield (0, category_1.getCategoryService)();
    res.status(status).json({ message, data });
});
exports.getCategories = getCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, name, image, slogan } = req.body;
    if (!categoryId || !req.user || !slogan || !name) {
        return res.status(400).json({ message: 'Not found' });
    }
    const data = yield (0, category_1.editCategory)(categoryId.toString(), name, image, slogan, req.user);
    if (data) {
        return res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
    }
});
exports.updateCategory = updateCategory;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image, slogan } = req.body;
    if (!name || !slogan || (image === null || image === void 0 ? void 0 : image.length) || !req.user) {
        return res.status(400).json({ message: 'Not found' });
    }
    const data = yield (0, category_1.createCategoryService)(name, slogan, image, req.user);
    if (data) {
        return res.status(data.status).json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
    }
});
exports.createCategory = createCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.query.categoryId;
    if (!categoryId || !req.user) {
        return res.status(400).json({ message: "Not found" });
    }
    const data = yield (0, category_1.deleteCategoryService)(categoryId.toString(), req.user);
    if (data) {
        return res
            .status(data.status)
            .json({ message: data.message });
    }
});
exports.deleteCategory = deleteCategory;
