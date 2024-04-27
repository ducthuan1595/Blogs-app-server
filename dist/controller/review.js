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
exports.createReview = void 0;
const service_review_1 = require("../service/service.review");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    if (!message || !req.user) {
        return res.status(404).json({ message: "Not found" });
    }
    const data = yield (0, service_review_1.createReviewService)(message, req.user);
    if (data) {
        return res
            .status(data.status)
            .json({ message: data.message, data: data === null || data === void 0 ? void 0 : data.data });
    }
});
exports.createReview = createReview;
