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
exports.BlogServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const blog_model_1 = require("./blog.model");
const blog_const_1 = require("./blog.const");
const user_model_1 = require("../user/user.model");
const blog_utils_1 = require("./blog.utils");
const error_const_1 = require("../../errors/error.const");
const createBlogIntoDB = (userData, blog) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isExistsByEmail(userData.email);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User does not exists', error_const_1.ERROR_TYPE.NOT_FOUND_ERROR);
    }
    const result = yield blog_model_1.Blog.create(Object.assign(Object.assign({}, blog), { author: user._id }));
    return result;
});
const getAllBlogsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const blogQuery = new QueryBuilder_1.default(blog_model_1.Blog.find().populate('author'), query)
        .search(blog_const_1.blogSearchFields)
        .sort()
        .filter()
        .select();
    const result = yield blogQuery.modelQuery;
    return result;
});
const deleteSingleBlogFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, blog_utils_1.deleteBlogPermissionCheck)(id, user);
    const deletedBlog = yield blog_model_1.Blog.findByIdAndDelete({ _id: id });
    return deletedBlog;
});
const updateSingleBlogIntoDB = (id, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, blog_utils_1.updateBlogPermissionCheck)(id, user);
    const updatedBlog = yield blog_model_1.Blog.findByIdAndUpdate({ _id: id }, payload, {
        new: true,
        select: '_id title content author',
    }).populate('author');
    return updatedBlog;
});
exports.BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    deleteSingleBlogFromDB,
    updateSingleBlogIntoDB,
};
