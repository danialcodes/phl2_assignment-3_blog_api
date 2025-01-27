import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Blog } from './blog.model';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.const';
import { ERROR_TYPE } from '../../errors/error.const';

export const deleteBlogPermissionCheck = async (
    blogId: string,
    user: JwtPayload,
) => {
    const { email, role } = user;
    // check if blog exists
    const isBlogExists = await Blog.isExists(blogId);
    if (!isBlogExists) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'Blog not found',
            ERROR_TYPE.NOT_FOUND_ERROR,
        );
    }

    // check if blog author is same as the user or admin
    if (role !== USER_ROLE.admin) {
        const isUserExists = await User.isExistsByEmail(email);
        if (!isUserExists) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                'Invalid credentials',
                ERROR_TYPE.AUTHORIZATION_ERROR,
            );
        } else if (
            !(isBlogExists.author.toString() == isUserExists._id?.toString())
        ) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                'Invalid credentials',
                ERROR_TYPE.AUTHORIZATION_ERROR,
            );
        }
    }
};

export const updateBlogPermissionCheck = async (
    blogId: string,
    user: JwtPayload,
) => {
    const { email } = user;
    // check if blog exists
    const isBlogExists = await Blog.isExists(blogId);
    if (!isBlogExists) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'Blog not found',
            ERROR_TYPE.NOT_FOUND_ERROR,
        );
    }
    // check if blog author is same as the user
    const isUserExists = await User.isExistsByEmail(email);
    if (!isUserExists) {
        throw new AppError(
            StatusCodes.UNAUTHORIZED,
            'Invalid credentials',
            ERROR_TYPE.AUTHORIZATION_ERROR,
        );
    } else if (
        !(isBlogExists.author.toString() == isUserExists._id?.toString())
    ) {
        throw new AppError(
            StatusCodes.UNAUTHORIZED,
            'Invalid credentials',
            ERROR_TYPE.AUTHORIZATION_ERROR,
        );
    }
};
