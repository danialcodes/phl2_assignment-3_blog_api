import { StatusCodes } from 'http-status-codes';

import AppError from '../../errors/AppError';

import { User } from '../user/user.model';
import { Blog } from '../blog/blog.model';
import { ERROR_TYPE } from '../../errors/error.const';

const blockSingleUserFromDB = async (userId: string) => {
    const user = await User.isExists(userId);
    if (!user) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'User does not exists',
            ERROR_TYPE.NOT_FOUND_ERROR,
        );
    }
    if (user.isBlocked) {
        throw new AppError(
            StatusCodes.CONFLICT,
            'User is already blocked',
            ERROR_TYPE.CONFLICT_ERROR,
        );
    }
    await User.blockUser(userId);
    return;
};

const deleteSingleBlogFromDB = async (bookId: string) => {
    const deletedBlog = await Blog.findByIdAndDelete({ _id: bookId });
    return deletedBlog;
};
export const AdminServices = {
    blockSingleUserFromDB,
    deleteSingleBlogFromDB,
};
