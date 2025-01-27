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
exports.updateBlogPermissionCheck = exports.deleteBlogPermissionCheck = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const blog_model_1 = require("./blog.model");
const user_model_1 = require("../user/user.model");
const user_const_1 = require("../user/user.const");
const error_const_1 = require("../../errors/error.const");
const deleteBlogPermissionCheck = (blogId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, role } = user;
    // check if blog exists
    const isBlogExists = yield blog_model_1.Blog.isExists(blogId);
    if (!isBlogExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Blog not found', error_const_1.ERROR_TYPE.NOT_FOUND_ERROR);
    }
    // check if blog author is same as the user or admin
    if (role !== user_const_1.USER_ROLE.admin) {
        const isUserExists = yield user_model_1.User.isExistsByEmail(email);
        if (!isUserExists) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
        }
        else if (!(isBlogExists.author.toString() == ((_a = isUserExists._id) === null || _a === void 0 ? void 0 : _a.toString()))) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
        }
    }
});
exports.deleteBlogPermissionCheck = deleteBlogPermissionCheck;
const updateBlogPermissionCheck = (blogId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = user;
    // check if blog exists
    const isBlogExists = yield blog_model_1.Blog.isExists(blogId);
    if (!isBlogExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Blog not found', error_const_1.ERROR_TYPE.NOT_FOUND_ERROR);
    }
    // check if blog author is same as the user
    const isUserExists = yield user_model_1.User.isExistsByEmail(email);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
    }
    else if (!(isBlogExists.author.toString() == ((_a = isUserExists._id) === null || _a === void 0 ? void 0 : _a.toString()))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials', error_const_1.ERROR_TYPE.AUTHORIZATION_ERROR);
    }
});
exports.updateBlogPermissionCheck = updateBlogPermissionCheck;
