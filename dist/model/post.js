"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    title: {
        type: String,
        require: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        require: true,
    },
    desc: {
        type: String,
        require: true,
    },
    image: [
        {
            url: {
                type: String,
                require: true,
            },
            public_id: {
                type: String,
                require: true,
            },
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model('Post', schema);
