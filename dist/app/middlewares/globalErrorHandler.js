"use strict";
/* eslint-disable no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleAppError_1 = __importDefault(require("../errors/handleAppError"));
const handleError_1 = __importDefault(require("../errors/handleError"));
const errorHandler = (error, req, res, next) => {
    let simplifiedError = {};
    // if error is instance of ZodError
    if (error instanceof zod_1.ZodError) {
        simplifiedError = (0, handleZodError_1.default)(error);
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
        simplifiedError = (0, handleValidationError_1.default)(error);
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'CastError') {
        simplifiedError = (0, handleCastError_1.default)(error);
    }
    else if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
        simplifiedError = (0, handleDuplicateError_1.default)(error);
    }
    else if (error instanceof AppError_1.default) {
        simplifiedError = (0, handleAppError_1.default)(error);
    }
    else if (error instanceof Error) {
        simplifiedError = (0, handleError_1.default)(error);
    }
    // default values
    const statusCode = simplifiedError.statusCode || error.statusCode || 500;
    const message = simplifiedError.message || error.message || 'Something went wrong';
    const errorSources = {
        details: simplifiedError.errorSources || [
            {
                path: '',
                message: 'Something went wrong',
            },
        ],
    };
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        error: errorSources,
        stack: config_1.default.node_env === 'development' ? error.stack : null,
    });
};
exports.default = errorHandler;
