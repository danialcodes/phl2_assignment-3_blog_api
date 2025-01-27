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
exports.AuthServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("./auth.utils");
const error_const_1 = require("../../errors/error.const");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = payload;
    const isUserExists = yield user_model_1.User.isExistsByEmail(email);
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'User already exists', error_const_1.ERROR_TYPE.CONFLICT_ERROR);
    }
    const userData = {
        name,
        email,
        password,
    };
    const newUser = yield user_model_1.User.create(userData);
    if (!newUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'User creation failed', error_const_1.ERROR_TYPE.INTERNAL_SERVER_ERROR);
    }
    return {
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExists = yield user_model_1.User.isExistsByEmail(email);
    if (!isUserExists ||
        isUserExists.isBlocked ||
        !(yield user_model_1.User.isPasswordMatched(password, isUserExists.password))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
    }
    // jwt token
    const jwtPayload = {
        email: isUserExists.email,
        role: isUserExists.role,
    };
    const accessToken = (0, auth_utils_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.generateToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const changePassword = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.isExistsByEmail(email);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
    }
    if (isUserExists.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'The user is blocked', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
    }
    // password checking
    if (!(yield user_model_1.User.isPasswordMatched(payload.oldPassword, isUserExists.password))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid password', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
    }
    // password update
    yield user_model_1.User.findOneAndUpdate({ email }, {
        password: yield user_model_1.User.hashThePassword(payload.newPassword),
        needsPasswordChange: false,
        passwordChangeAt: new Date(),
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify token
    const user = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email, iat } = user;
    const isUserExists = yield user_model_1.User.isExistsByEmail(email);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
    }
    if (isUserExists.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'The user is blocked', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
    }
    const passwordChangeAt = isUserExists.passwordChangeAt;
    if (passwordChangeAt) {
        if (user_model_1.User.isJWTExpired(iat, passwordChangeAt)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Expired Token', error_const_1.ERROR_TYPE.AUTH_ERROR);
        }
    }
    // jwt token refresh
    const jwtPayload = {
        email: isUserExists.email,
        role: isUserExists.role,
    };
    const accessToken = (0, auth_utils_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
exports.AuthServices = {
    registerUser,
    loginUser,
    changePassword,
    refreshToken,
};
