"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleAppError = (err) => {
    const errorSources = [
        {
            path: '',
            message: err === null || err === void 0 ? void 0 : err.message,
        },
    ];
    return {
        statusCode: err === null || err === void 0 ? void 0 : err.statusCode,
        message: `${err.name} : ${err === null || err === void 0 ? void 0 : err.message}`,
        errorSources,
    };
};
exports.default = handleAppError;
