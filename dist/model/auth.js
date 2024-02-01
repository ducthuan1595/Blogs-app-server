"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    role: {
        type: String,
        default: 'D0'
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        url: {
            type: String
        },
        public_id: String
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', schema);
