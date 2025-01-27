import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';
import { deleteBlogPermissionCheck } from '../blog/blog.utils';

const blockSingleUser: RequestHandler = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await AdminServices.blockSingleUserFromDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User blocked successfully',
    });
});
const deleteSingleBlog: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await deleteBlogPermissionCheck(id, req.user);

    await AdminServices.deleteSingleBlogFromDB(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Blog deleted successfully',
    });
});

export const AdminControllers = {
    blockSingleUser,
    deleteSingleBlog,
};
