"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageSection = void 0;
const pageSection = (page, limit, data) => {
    const totalPage = Math.ceil(data.length / limit);
    const start = (page - 1) * limit;
    const end = page * limit;
    const result = data.slice(start, end);
    return {
        result,
        totalPage
    };
};
exports.pageSection = pageSection;
