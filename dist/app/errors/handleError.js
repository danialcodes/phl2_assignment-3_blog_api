"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleError = (err) => {
    const errorSources = [
        {
            path: '',
            message: err === null || err === void 0 ? void 0 : err.message,
        },
    ];
    return {
        message: err === null || err === void 0 ? void 0 : err.message,
        errorSources,
    };
};
exports.default = handleError;
