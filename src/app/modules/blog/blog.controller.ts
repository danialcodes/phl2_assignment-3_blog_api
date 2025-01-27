import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';

const createBlog: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;

    const result = await BlogServices.createBlogIntoDB(user, req.body);

    const blogData = {
        _id: result._id,
        title: result.title,
        content: result.content,
        author: result.author,
    };

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Blog created successfully',
        data: blogData,
    });
});

const getAllBlogs: RequestHandler = asyncHandler(async (req, res) => {
    const result = await BlogServices.getAllBlogsFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Blogs fetched successfully',
        data: result,
    });
});

const updateSingleBlog: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await BlogServices.updateSingleBlogIntoDB(
        id,
        user,
        req.body,
    );

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Blog updated successfully',
        data: result,
    });
});

const deleteSingleBlog: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    await BlogServices.deleteSingleBlogFromDB(id, user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Blog deleted successfully',
    });
});

export const BlogControllers = {
    createBlog,
    getAllBlogs,
    deleteSingleBlog,
    updateSingleBlog,
};
