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
exports.editCategory = exports.getCategoryService = void 0;
const category_1 = __importDefault(require("../model/category"));
const getCategoryService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find();
        return {
            status: 201,
            message: 'ok',
            data: categories
        };
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.getCategoryService = getCategoryService;
const editCategory = (categoryId, name, image, slogan, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'F2') {
            return {
                status: 403,
                message: 'Unauthorized'
            };
        }
        const category = yield category_1.default.findById(categoryId);
        if (category) {
            category.name = name;
            category.slogan = slogan;
            if (image) {
                category.image = image;
            }
            const updated = yield category.save();
            return {
                status: 201,
                message: "ok",
                data: updated,
            };
        }
    }
    catch (err) {
        return {
            status: 500,
            message: 'Error from server'
        };
    }
});
exports.editCategory = editCategory;
