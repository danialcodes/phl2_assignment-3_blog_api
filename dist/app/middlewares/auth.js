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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
const error_const_1 = require("../errors/error.const");
const auth = (...requiredRoles) => {
    return (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized', error_const_1.ERROR_TYPE.AUTH_ERROR);
        }
        // verify token
        const user = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { role, email, iat } = user;
        const isUserExists = yield user_model_1.User.isExistsByEmail(email);
        if (!isUserExists || isUserExists.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized access token', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
        }
        const passwordChangeAt = isUserExists.passwordChangeAt;
        if (passwordChangeAt) {
            if (user_model_1.User.isJWTExpired(iat, passwordChangeAt)) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Expired access token', error_const_1.ERROR_TYPE.AUTH_ERROR);
            }
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized access token', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
        }
        req.user = user;
        next();
    }));
};
exports.default = auth;
