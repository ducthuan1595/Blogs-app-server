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
exports.deleteCategoryService = exports.createCategoryService = exports.editCategory = exports.getCategoryService = void 0;
const category_1 = __importDefault(require("../model/category"));
const cloudinary_1 = require("../utils/cloudinary");
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
    var _a, _b;
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
                if ((_a = category.image) === null || _a === void 0 ? void 0 : _a.public_id) {
                    yield (0, cloudinary_1.destroyClodinary)((_b = category.image) === null || _b === void 0 ? void 0 : _b.public_id);
                }
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
const createCategoryService = (name, slogan, image, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (user.role !== 'F2') {
            return {
                status: 403,
                message: 'Unauthorized!'
            };
        }
        const category = new category_1.default({
            name,
            slogan,
            image,
        });
        const newCategory = yield category.save();
        return {
            status: 200,
            message: "ok",
            data: newCategory,
        };
    }
    catch (err) {
        return {
            status: 500,
            message: "Error from server",
        };
    }
});
exports.createCategoryService = createCategoryService;
const deleteCategoryService = (categoryId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const category = yield category_1.default.findById(categoryId);
        if (category && user.role !== "F2") {
            if ((_c = category.image) === null || _c === void 0 ? void 0 : _c.public_id) {
                yield (0, cloudinary_1.destroyClodinary)((_d = category.image) === null || _d === void 0 ? void 0 : _d.public_id);
            }
            return {
                status: 302,
                message: "Unauthorized",
            };
        }
        yield category_1.default.findByIdAndDelete(categoryId);
        return {
            status: 200,
            message: 'ok'
        };
    }
    catch (err) {
        return {
            status: 500,
            message: "Error from server",
        };
    }
});
exports.deleteCategoryService = deleteCategoryService;
