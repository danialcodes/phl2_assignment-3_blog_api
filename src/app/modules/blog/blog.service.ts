import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';
import { blogSearchFields } from './blog.const';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import {
    deleteBlogPermissionCheck,
    updateBlogPermissionCheck,
} from './blog.utils';
import { ERROR_TYPE } from '../../errors/error.const';

const createBlogIntoDB = async (userData: JwtPayload, blog: Partial<IBlog>) => {
    const user = await User.isExistsByEmail(userData.email);
    if (!user) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'User does not exists',
            ERROR_TYPE.NOT_FOUND_ERROR,
        );
    }
    const result = await Blog.create({
        ...blog,
        author: user._id,
    });

    return result;
};

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
    const blogQuery = new QueryBuilder(Blog.find().populate('author'), query)
        .search(blogSearchFields)
        .sort()
        .filter()
        .select();
    const result = await blogQuery.modelQuery;
    return result;
};

const deleteSingleBlogFromDB = async (id: string, user: JwtPayload) => {
    await deleteBlogPermissionCheck(id, user);

    const deletedBlog = await Blog.findByIdAndDelete({ _id: id });
    return deletedBlog;
};
const updateSingleBlogIntoDB = async (
    id: string,
    user: JwtPayload,
    payload: Partial<IBlog>,
) => {
    await updateBlogPermissionCheck(id, user);

    const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, payload, {
        new: true,
        select: '_id title content author',
    }).populate('author');
    return updatedBlog;
};

export const BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    deleteSingleBlogFromDB,
    updateSingleBlogIntoDB,
};
