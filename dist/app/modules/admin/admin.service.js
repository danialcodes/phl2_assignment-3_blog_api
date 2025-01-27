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
exports.AdminServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const blog_model_1 = require("../blog/blog.model");
const error_const_1 = require("../../errors/error.const");
const blockSingleUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isExists(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User does not exists', error_const_1.ERROR_TYPE.NOT_FOUND_ERROR);
    }
    if (user.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'User is already blocked', error_const_1.ERROR_TYPE.CONFLICT_ERROR);
    }
    yield user_model_1.User.blockUser(userId);
    return;
});
const deleteSingleBlogFromDB = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedBlog = yield blog_model_1.Blog.findByIdAndDelete({ _id: bookId });
    return deletedBlog;
});
exports.AdminServices = {
    blockSingleUserFromDB,
    deleteSingleBlogFromDB,
};
